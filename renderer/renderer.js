let webview = null
let isLoading = true
let docmostUrl = 'https://work.drewl.com'

document.addEventListener('DOMContentLoaded', async () => {
  webview = document.getElementById('docmost-webview')
  const loadingOverlay = document.getElementById('loading')
  
  docmostUrl = await window.docmostAPI.getDocmostUrl()
  webview.src = docmostUrl
  
  webview.addEventListener('did-finish-load', () => {
    if (isLoading) {
      isLoading = false
      loadingOverlay.classList.add('hidden')
    }
  })
  
  webview.addEventListener('did-fail-load', (event) => {
    console.error('Failed to load:', event.errorDescription)
    if (event.errorCode === -3) return
    loadingOverlay.innerHTML = `
      <div class="loading-logo">Connection Error</div>
      <p style="color: #888; margin-bottom: 20px;">Unable to connect to Docmost at ${docmostUrl}</p>
      <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer; border: none; border-radius: 6px; background: #6366f1; color: white;">Retry</button>
    `
  })
  
  webview.addEventListener('new-window', (event) => {
    window.docmostAPI.openExternal(event.url)
  })
  
  window.docmostAPI.onMenuAction((action) => {
    executeMenuAction(action)
  })
  
  window.docmostAPI.onUrlChanged((url) => {
    docmostUrl = url
    webview.loadURL(url)
  })
})

function sendKeyboardShortcut(key, modifiers = {}) {
  webview.executeJavaScript(`
    (function() {
      const key = '${key}';
      const modifiers = ${JSON.stringify(modifiers)};
      
      const eventInit = {
        key: key,
        code: key.length === 1 ? 'Key' + key.toUpperCase() : key,
        bubbles: true,
        cancelable: true,
        ctrlKey: modifiers.ctrl || false,
        metaKey: modifiers.meta || false,
        shiftKey: modifiers.shift || false,
        altKey: modifiers.alt || false
      };
      
      if (key === ' ') {
        eventInit.code = 'Space';
      } else if (key >= '0' && key <= '9') {
        eventInit.code = 'Digit' + key;
      }
      
      const keydownEvent = new KeyboardEvent('keydown', eventInit);
      const keyupEvent = new KeyboardEvent('keyup', eventInit);
      
      const activeElement = document.activeElement || document.body;
      activeElement.dispatchEvent(keydownEvent);
      activeElement.dispatchEvent(keyupEvent);
      document.dispatchEvent(keydownEvent);
      document.dispatchEvent(keyupEvent);
    })()
  `).catch(() => {})
}

function executeMenuAction(action) {
  if (!webview) return
  
  switch (action) {
    case 'reload':
      webview.reload()
      break
      
    case 'forceReload':
      webview.reloadIgnoringCache()
      break
      
    case 'toggleDevTools':
      if (webview.isDevToolsOpened()) {
        webview.closeDevTools()
      } else {
        webview.openDevTools()
      }
      break
      
    case 'zoomIn':
      webview.setZoomFactor(Math.min(webview.getZoomFactor() + 0.1, 3))
      break
      
    case 'zoomOut':
      webview.setZoomFactor(Math.max(webview.getZoomFactor() - 0.1, 0.3))
      break
      
    case 'zoomReset':
      webview.setZoomFactor(1)
      break
      
    case 'goBack':
      if (webview.canGoBack()) webview.goBack()
      break
      
    case 'goForward':
      if (webview.canGoForward()) webview.goForward()
      break
      
    case 'goHome':
      webview.loadURL(docmostUrl)
      break
      
    case 'quickSearch':
      sendKeyboardShortcut('k', { meta: true })
      break
      
    case 'find':
      sendKeyboardShortcut('f', { meta: true })
      break
      
    case 'bold':
      sendKeyboardShortcut('b', { meta: true })
      break
      
    case 'italic':
      sendKeyboardShortcut('i', { meta: true })
      break
      
    case 'underline':
      sendKeyboardShortcut('u', { meta: true })
      break
      
    case 'strikethrough':
      sendKeyboardShortcut('s', { meta: true, shift: true })
      break
      
    case 'highlight':
      sendKeyboardShortcut('h', { meta: true, shift: true })
      break
      
    case 'inlineCode':
      sendKeyboardShortcut('e', { meta: true })
      break
      
    case 'heading1':
      sendKeyboardShortcut('1', { meta: true, alt: true })
      break
      
    case 'heading2':
      sendKeyboardShortcut('2', { meta: true, alt: true })
      break
      
    case 'heading3':
      sendKeyboardShortcut('3', { meta: true, alt: true })
      break
      
    case 'normalText':
      sendKeyboardShortcut('0', { meta: true, alt: true })
      break
      
    case 'bulletList':
      sendKeyboardShortcut('8', { meta: true, shift: true })
      break
      
    case 'numberedList':
      sendKeyboardShortcut('7', { meta: true, shift: true })
      break
      
    case 'taskList':
      sendKeyboardShortcut('9', { meta: true, shift: true })
      break
      
    case 'blockquote':
      sendKeyboardShortcut('b', { meta: true, shift: true })
      break
      
    case 'codeBlock':
      sendKeyboardShortcut('c', { meta: true, alt: true })
      break
      
    default:
      console.log('Unknown action:', action)
  }
}
