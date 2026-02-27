const { contextBridge, ipcRenderer, shell } = require('electron')

contextBridge.exposeInMainWorld('docmostAPI', {
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action))
  },
  onUrlChanged: (callback) => {
    ipcRenderer.on('url-changed', (event, url) => callback(url))
  },
  getDocmostUrl: () => {
    return ipcRenderer.invoke('get-docmost-url')
  },
  setDocmostUrl: (url) => {
    return ipcRenderer.invoke('set-docmost-url', url)
  },
  openExternal: (url) => {
    shell.openExternal(url)
  }
})
