const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld('electronAPI', {
    startServer: (a, b) => ipcRenderer.invoke('startServer', a, b),
    randBytes: () => ipcRenderer.invoke('randBytes'),
    onDebugLog: (callback) => ipcRenderer.on('log', callback),
    getStore: (a) => ipcRenderer.invoke('getStore', a),
    setStore: (a, b) => ipcRenderer.invoke('setStore', a, b),
});