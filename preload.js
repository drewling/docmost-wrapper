const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('docmostAPI', {
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action))
  },
  executeAction: (action) => {
    ipcRenderer.send('execute-action', action)
  }
})
