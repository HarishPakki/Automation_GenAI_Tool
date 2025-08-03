const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  startRecording: (appPath) => ipcRenderer.invoke('recorder:start', appPath),
  stopRecording: () => ipcRenderer.invoke('recorder:stop'),
  getRecordingStatus: () => ipcRenderer.invoke('recorder:status'),
  executeScript: (options) => ipcRenderer.invoke('recorder:execute', options),
  saveFile: (options) => ipcRenderer.invoke('file:save', options)
});
