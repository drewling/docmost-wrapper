const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store()

let mainWindow = null
let settingsWindow = null

function getDocmostUrl() {
  return store.get('docmostUrl') || null
}

function setDocmostUrl(url) {
  store.set('docmostUrl', url)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Docmost',
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 420,
    height: 220,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'Settings',
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  settingsWindow.loadFile(path.join(__dirname, 'renderer', 'settings.html'))

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

function createMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Settings...',
          accelerator: 'Cmd+,',
          click: () => createSettingsWindow()
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'Cmd+Shift+N',
          click: () => createWindow()
        },
        { type: 'separator' },
        {
          label: 'Close Window',
          accelerator: 'Cmd+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find and Replace',
          accelerator: 'Cmd+F',
          click: () => sendAction('find')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Cmd+R',
          click: () => sendAction('reload')
        },
        {
          label: 'Force Reload',
          accelerator: 'Cmd+Shift+R',
          click: () => sendAction('forceReload')
        },
        { type: 'separator' },
        {
          label: 'Toggle DevTools',
          accelerator: 'Cmd+Option+I',
          click: () => sendAction('toggleDevTools')
        },
        { type: 'separator' },
        {
          label: 'Zoom In',
          accelerator: 'Cmd+Plus',
          click: () => sendAction('zoomIn')
        },
        {
          label: 'Zoom Out',
          accelerator: 'Cmd+-',
          click: () => sendAction('zoomOut')
        },
        {
          label: 'Actual Size',
          accelerator: 'Cmd+0',
          click: () => sendAction('zoomReset')
        },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Cmd+[',
          click: () => sendAction('goBack')
        },
        {
          label: 'Forward',
          accelerator: 'Cmd+]',
          click: () => sendAction('goForward')
        },
        { type: 'separator' },
        {
          label: 'Quick Search',
          accelerator: 'Cmd+K',
          click: () => sendAction('quickSearch')
        },
        {
          label: 'Go to Home',
          accelerator: 'Cmd+Shift+H',
          click: () => sendAction('goHome')
        }
      ]
    },
    {
      label: 'Format',
      submenu: [
        {
          label: 'Bold',
          accelerator: 'Cmd+B',
          click: () => sendAction('bold')
        },
        {
          label: 'Italic',
          accelerator: 'Cmd+I',
          click: () => sendAction('italic')
        },
        {
          label: 'Underline',
          accelerator: 'Cmd+U',
          click: () => sendAction('underline')
        },
        {
          label: 'Strikethrough',
          accelerator: 'Cmd+Shift+S',
          click: () => sendAction('strikethrough')
        },
        {
          label: 'Highlight',
          accelerator: 'Cmd+Shift+H',
          click: () => sendAction('highlight')
        },
        {
          label: 'Inline Code',
          accelerator: 'Cmd+E',
          click: () => sendAction('inlineCode')
        },
        { type: 'separator' },
        {
          label: 'Heading 1',
          accelerator: 'Cmd+Alt+1',
          click: () => sendAction('heading1')
        },
        {
          label: 'Heading 2',
          accelerator: 'Cmd+Alt+2',
          click: () => sendAction('heading2')
        },
        {
          label: 'Heading 3',
          accelerator: 'Cmd+Alt+3',
          click: () => sendAction('heading3')
        },
        {
          label: 'Normal Text',
          accelerator: 'Cmd+Alt+0',
          click: () => sendAction('normalText')
        },
        { type: 'separator' },
        {
          label: 'Bullet List',
          accelerator: 'Cmd+Shift+8',
          click: () => sendAction('bulletList')
        },
        {
          label: 'Numbered List',
          accelerator: 'Cmd+Shift+7',
          click: () => sendAction('numberedList')
        },
        {
          label: 'Task List',
          accelerator: 'Cmd+Shift+9',
          click: () => sendAction('taskList')
        },
        {
          label: 'Blockquote',
          accelerator: 'Cmd+Shift+B',
          click: () => sendAction('blockquote')
        },
        {
          label: 'Code Block',
          accelerator: 'Cmd+Alt+C',
          click: () => sendAction('codeBlock')
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Docmost Documentation',
          click: () => shell.openExternal('https://docmost.com/docs')
        },
        {
          label: 'Keyboard Shortcuts',
          click: () => shell.openExternal('https://docmost.com/docs/user-guide/editor#keyboard-shortcuts')
        },
        { type: 'separator' },
        {
          label: 'Report an Issue',
          click: () => shell.openExternal('https://github.com/docmost/docmost/issues')
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function sendAction(action) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('menu-action', action)
  }
}

ipcMain.handle('get-docmost-url', () => {
  return getDocmostUrl()
})

ipcMain.handle('set-docmost-url', (event, url) => {
  setDocmostUrl(url)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('url-changed', url)
  }
  return true
})

app.whenReady().then(() => {
  createWindow()
  createMenu()
  
  if (!getDocmostUrl()) {
    createSettingsWindow()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
