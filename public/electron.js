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

// File chooser
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Executables', extensions: ['exe'] }]
  });
  return result.filePaths[0];
});

// Start recording
ipcMain.handle('recorder:start', async (_, appPath) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const outputFile = path.join(__dirname, `recording-${timestamp}.py`);
    const xpathFile = path.join(__dirname, `xpaths-${timestamp}.txt`);

    appProcess = spawn(`"${appPath}"`, [
      '--remote-debugging-port=9222',
      '--no-sandbox',
      '--disable-gpu'
    ], {
      shell: true,
      detached: true,
      stdio: 'ignore'
    });

    // Wait for remote-debug port
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
        `--output=${outputFile}`,
        'http://localhost:9222'
      ], {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let xpaths = '';

      recordingProcess.stdout.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/"xpath=(.*?)"/);
        if (match) {
          xpaths += `${match[1]}\n`;
          fs.appendFileSync(xpathFile, `${match[1]}\n`);
        }
      });

      recordingProcess.stderr.on('data', (data) => {
        console.error('[Playwright ERROR]', data.toString());
      });

      recordingProcess.on('close', (code) => {
        const pythonCode = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, 'utf8') : '';
        const xpathText = fs.existsSync(xpathFile) ? fs.readFileSync(xpathFile, 'utf8') : '';

        console.log('✔️ Python Code:\n', pythonCode || '[EMPTY]');
        console.log('✔️ XPaths:\n', xpathText || '[EMPTY]');

        resolve({
          pythonCode,
          xpaths: xpathText,
          pyFile: outputFile,
          xpathFile: xpathFile
        });
      });
    }

    // Auto-stop after 30s timeout
    setTimeout(() => {
      clearInterval(waitForDebugPort);
      reject({ error: 'Recording timed out (30s)' });
    }, 30000);
  });
});

// Stop session
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

// Execute script
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

// Save to file
ipcMain.handle('file:save', (_, { filename, content }) => {
  try {
    fs.writeFileSync(filename, content);
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
});

// Status check
ipcMain.handle('recorder:status', () => ({
  isRecording: !!recordingProcess
}));

// On app exit
app.on('before-quit', () => {
  [recordingProcess, appProcess].forEach(proc => {
    try {
      if (proc) process.kill(proc.pid);
    } catch (_) { }
  });
});
