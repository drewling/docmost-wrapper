const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const log = require('electron-log')

const DOCMOST_URL = 'https://work.drewl.com'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Docmost',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 }
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createMenu() {
  const template = [
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
          click: () => {
            const win = BrowserWindow.getFocusedWindow()
            if (win) win.close()
          }
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
        { role: 'selectAll' }
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
      label: 'Actions',
      submenu: [
        {
          label: 'New Page',
          accelerator: 'Cmd+N',
          click: () => sendAction('newPage')
        },
        {
          label: 'Toggle Sidebar',
          accelerator: 'Cmd+\\',
          click: () => sendAction('toggleSidebar')
        },
        {
          label: 'Toggle Comments',
          accelerator: 'Cmd+Shift+C',
          click: () => sendAction('toggleComments')
        },
        { type: 'separator' },
        {
          label: 'Focus Mode',
          accelerator: 'Cmd+Shift+F',
          click: () => sendAction('focusMode')
        }
      ]
    },
    {
      label: 'Insert',
      submenu: [
        {
          label: 'Mermaid Diagram',
          accelerator: 'Cmd+Shift+M',
          click: () => sendAction('insertMermaid')
        },
        {
          label: 'Draw.io Diagram',
          accelerator: 'Cmd+Shift+D',
          click: () => sendAction('insertDrawio')
        },
        {
          label: 'Excalidraw Diagram',
          accelerator: 'Cmd+Shift+E',
          click: () => sendAction('insertExcalidraw')
        },
        { type: 'separator' },
        {
          label: 'Table',
          accelerator: 'Cmd+Shift+T',
          click: () => sendAction('insertTable')
        },
        {
          label: 'Code Block',
          accelerator: 'Cmd+Option+C',
          click: () => sendAction('insertCodeBlock')
        },
        {
          label: 'Callout',
          accelerator: 'Cmd+Option+A',
          click: () => sendAction('insertCallout')
        }
      ]
    },
    {
      label: 'Share',
      submenu: [
        {
          label: 'Share Page Publicly',
          click: () => sendAction('sharePage')
        },
        {
          label: 'Copy Page Link',
          accelerator: 'Cmd+L',
          click: () => sendAction('copyLink')
        }
      ]
    },
    {
      label: 'Export',
      submenu: [
        {
          label: 'Export as Markdown',
          accelerator: 'Cmd+Shift+E',
          click: () => sendAction('exportMarkdown')
        },
        {
          label: 'Export as HTML',
          click: () => sendAction('exportHtml')
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
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
          click: () => sendAction('showShortcuts')
        },
        { type: 'separator' },
        {
          label: 'Report an Issue',
          click: () => shell.openExternal('https://github.com/docmost/docmost/issues')
        },
        { type: 'separator' },
        {
          label: 'About Docmost',
          click: () => sendAction('showAbout')
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

ipcMain.on('execute-action', (event, action) => {
  sendAction(action)
})

app.whenReady().then(() => {
  createWindow()
  createMenu()

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

app.on('before-quit', () => {
  log.info('Application shutting down')
})
