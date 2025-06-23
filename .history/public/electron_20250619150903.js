const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.whenReady().then(createWindow);
