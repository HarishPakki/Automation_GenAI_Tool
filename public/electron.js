const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let recordingProcess = null;
let electronAppProcess = null;
let executionProcess = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  win.loadURL(startUrl);
}

ipcMain.handle('dialog:openFile', () => {
  return dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Applications', extensions: ['exe', 'app'] }]
  }).then(result => result.filePaths[0]);
});

ipcMain.handle('recorder:start', async (_, appPath) => {
  if (recordingProcess) return { error: "Recording already in progress" };

  return new Promise((resolve, reject) => {
    try {
      // Launch the Electron app
      electronAppProcess = spawn(appPath, ['--remote-debugging-port=9222'], {
        detached: true,
        stdio: 'ignore'
      });

      // Generate unique filenames
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const pyFile = path.join(__dirname, `recording-${timestamp}.py`);
      const xpathFile = path.join(__dirname, `xpaths-${timestamp}.txt`);

      // Get the correct playwright command
      const playwrightBin = process.platform === 'win32'
        ? path.join(__dirname, 'node_modules', '.bin', 'playwright.cmd')
        : path.join(__dirname, 'node_modules', '.bin', 'playwright');

      // Start Playwright recorder
      recordingProcess = spawn(playwrightBin, [
        'codegen',
        '--target=python',
        `--output=${pyFile}`,
        '--save-storage=auth.json',
        'http://localhost:9222'
      ], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Error handling
      recordingProcess.on('error', (err) => {
        console.error('Recorder error:', err);
        reject({ error: `Recorder failed to start: ${err.message}` });
      });

      // Capture XPaths
      let xpaths = '';
      recordingProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('page.')) {
          const xpath = extractXPath(output);
          if (xpath) {
            xpaths += `${xpath}\n`;
            fs.appendFileSync(xpathFile, `${xpath}\n`);
          }
        }
      });

      recordingProcess.stderr.on('data', (data) => {
        console.error('Recorder stderr:', data.toString());
      });

      recordingProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const pythonCode = fs.readFileSync(pyFile, 'utf8');
            resolve({
              pythonCode,
              xpaths: fs.readFileSync(xpathFile, 'utf8'),
              pyFile,
              xpathFile
            });
          } catch (readError) {
            reject({ error: `Failed to read output files: ${readError.message}` });
          }
        } else {
          reject({ error: `Recording process exited with code ${code}` });
        }
      });
    } catch (err) {
      reject({ error: `Recording setup failed: ${err.message}` });
    }
  });
});

function extractXPath(codeLine) {
  const match = codeLine.match(/\('(.+?)'\)/);
  return match ? match[1].replace('xpath=', '') : null;
}

ipcMain.handle('recorder:stop', () => {
  [recordingProcess, electronAppProcess].forEach(proc => {
    if (proc) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
        } else {
          proc.kill();
        }
      } catch (err) {
        console.error('Error killing process:', err);
      }
      proc = null;
    }
  });
  return { status: 'stopped' };
});

// ... rest of your existing code ...
ipcMain.handle('recorder:execute', async (_, { script, filePath }) => {
  return new Promise((resolve) => {
    const logs = [];
    executionProcess = spawn('python', [filePath || '-c', script], {
      stdio: ['inherit', 'pipe', 'pipe']
    });

    executionProcess.stdout.on('data', (data) => {
      logs.push(data.toString().trim());
    });

    executionProcess.stderr.on('data', (data) => {
      logs.push(`ERROR: ${data.toString().trim()}`);
    });

    executionProcess.on('close', (code) => {
      resolve({ logs, exitCode: code });
    });

    executionProcess.on('error', (err) => {
      logs.push(`Failed to start execution: ${err.message}`);
      resolve({ logs, exitCode: -1 });
    });
  });
});

ipcMain.handle('recorder:status', () => ({
  isRecording: !!recordingProcess,
  isExecuting: !!executionProcess
}));

ipcMain.handle('file:save', (_, { filename, content }) => {
  try {
    fs.writeFileSync(filename, content);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
});

app.on('before-quit', () => {
  [recordingProcess, electronAppProcess, executionProcess].forEach(proc => {
    if (proc) {
      proc.kill();
      proc = null;
    }
  });
});

app.whenReady().then(createWindow);