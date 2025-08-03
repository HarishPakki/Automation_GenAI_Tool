const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Existing APIs
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  getData: () => ipcRenderer.invoke('sql:query'),
  
  // Enhanced Recording APIs
  startRecording: (appPath) => ipcRenderer.invoke('recorder:start', appPath),
  stopRecording: () => ipcRenderer.invoke('recorder:stop'),
  executeScript: (options) => ipcRenderer.invoke('recorder:execute', options),
  getRecordingStatus: () => ipcRenderer.invoke('recorder:status'),
  saveFile: (options) => ipcRenderer.invoke('file:save', options)
});