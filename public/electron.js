const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');

let recordingProcess = null;
let appProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL(process.env.ELECTRON_START_URL || 'http://localhost:3000');
}

app.whenReady().then(createWindow);

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }]
  });
  return result.filePaths[0];
});

ipcMain.handle('recorder:start', async (_, { appPath, enableSelfHealing }) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const pageObjectFile = path.join(__dirname, `page_objects_${timestamp}.py`);
    const testScriptFile = path.join(__dirname, `test_script_${timestamp}.py`);

    appProcess = spawn(`"${appPath}"`, [
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-gpu'
    ], {
      shell: true,
      detached: true,
      stdio: 'ignore'
    });

    const maxAttempts = 30;
    let attempts = 0;

    const waitForDebugPort = setInterval(() => {
      http.get('http://localhost:9222/json/version', (res) => {
        if (res.statusCode === 200) {
          clearInterval(waitForDebugPort);
          startRecordingSession();
        }
      }).on('error', () => {
        if (++attempts >= maxAttempts) {
          clearInterval(waitForDebugPort);
          reject({ error: 'Timeout: app did not expose port 9222' });
        }
      });
    }, 1000);

    function startRecordingSession() {
      const playwrightBin = process.platform === 'win32'
        ? path.join(process.env.APPDATA, 'npm', 'playwright.cmd')
        : 'playwright';

      recordingProcess = spawn(playwrightBin, [
        'codegen',
        '--target=python',
        '--output=-',
        'http://localhost:9222'
      ], {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let pageObjects = [];
      let testScript = '';

      recordingProcess.stdout.on('data', (data) => {
        const output = data.toString();
        const interactionMatch = output.match(/page\.(click|fill|press)\(['"](.*?)['"]\)/);
        
        if (interactionMatch) {
          const [_, actionType, selector] = interactionMatch;
          const methodName = `action_${pageObjects.length + 1}`;
          
          const { methodCode, testLine } = generatePythonCode({
            actionType,
            selector,
            methodName,
            enableSelfHealing
          });

          pageObjects.push(methodCode);
          testScript += testLine;
        }
      });

      recordingProcess.on('close', () => {
        const pageObjectContent = `from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException, TimeoutException

class GeneratedPage:
    def __init__(self, driver):
        self.driver = driver
        self.page = self

${pageObjects.join('\n')}`;

        const testScriptContent = `from page_objects import GeneratedPage

def test_generated_flow(driver):
    page = GeneratedPage(driver)
${testScript}
    return True`;

        fs.writeFileSync(pageObjectFile, pageObjectContent);
        fs.writeFileSync(testScriptFile, testScriptContent);

        resolve({
          pageObjects: pageObjectContent,
          testScript: testScriptContent,
          pageObjectFile,
          testScriptFile
        });
      });
    }

    function generatePythonCode({ actionType, selector, methodName, enableSelfHealing }) {
      const actions = {
        click: 'element.click()',
        fill: 'element.send_keys("TEST_DATA")',
        press: 'element.send_keys(Keys.RETURN)'
      };

      const action = actions[actionType] || 'element.click()';
      const description = `Performs ${actionType} action on element located by "${selector}"`;

      let methodCode, testLine;

      if (enableSelfHealing) {
        methodCode = `
    def ${methodName}(self, retries=3):
        """${description} with self-healing"""
        locators = [
            "${selector}",  # Primary locator
            "//*[contains(text(), '${selector.split('=').pop().replace(/['"]/g, '')}')]",  # Text fallback
            "//*[contains(@id, '${selector.split('=').pop().replace(/['"]/g, '').slice(0, 4)}')]"  # Partial ID
        ]
        
        for attempt in range(retries):
            for locator in locators:
                try:
                    element = WebDriverWait(self.driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, locator)))
                    ${action}
                    return element
                except (NoSuchElementException, TimeoutException):
                    if attempt == retries - 1 and locator == locators[-1]:
                        raise
                    continue`;
      } else {
        methodCode = `
    def ${methodName}(self):
        """${description}"""
        element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "${selector}")))
        ${action}
        return element`;
      }

      testLine = `    page.${methodName}()\n`;
      
      return { methodCode, testLine };
    }

    setTimeout(() => {
      clearInterval(waitForDebugPort);
      reject({ error: 'Recording timed out (30s)' });
    }, 30000);
  });
});

ipcMain.handle('recorder:stop', () => {
  [recordingProcess, appProcess].forEach(proc => {
    if (proc) {
      try {
        process.kill(proc.pid);
      } catch (_) { }
    }
  });
  recordingProcess = null;
  appProcess = null;
  return { status: 'stopped' };
});

ipcMain.handle('recorder:execute', async (_, { script, filePath }) => {
  return new Promise((resolve) => {
    const logs = [];
    const proc = spawn('python', [filePath || '-c', script], {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    proc.stdout.on('data', data => logs.push(data.toString()));
    proc.stderr.on('data', data => logs.push(`ERROR: ${data.toString()}`));
    proc.on('close', () => resolve({ logs }));
  });
});

ipcMain.handle('file:save', (_, { filename, content }) => {
  try {
    fs.writeFileSync(filename, content);
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
});

ipcMain.handle('recorder:status', () => ({
  isRecording: !!recordingProcess
}));

app.on('before-quit', () => {
  [recordingProcess, appProcess].forEach(proc => {
    try {
      if (proc) process.kill(proc.pid);
    } catch (_) { }
  });
});