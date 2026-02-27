const DOCMOST_URL = 'https://work.drewl.com'
let webview = null
let isLoading = true

document.addEventListener('DOMContentLoaded', () => {
  webview = document.getElementById('docmost-webview')
  const loadingOverlay = document.getElementById('loading')
  
  webview.addEventListener('did-finish-load', () => {
    if (isLoading) {
      isLoading = false
      loadingOverlay.classList.add('hidden')
    }
    injectHelperScript()
  })
  
  webview.addEventListener('did-fail-load', (event) => {
    console.error('Failed to load:', event.errorDescription)
    if (event.errorCode === -3) return
    loadingOverlay.innerHTML = `
      <div class="loading-logo">Connection Error</div>
      <p style="color: #888; margin-bottom: 20px;">Unable to connect to Docmost</p>
      <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer;">Retry</button>
    `
  })
  
  webview.addEventListener('new-window', (event) => {
    require('electron').shell.openExternal(event.url)
  })
  
  window.docmostAPI.onMenuAction((action) => {
    executeMenuAction(action)
  })
})

function injectHelperScript() {
  webview.executeJavaScript(`
    (function() {
      window.docmostHelper = {
        findElement: (selectors) => {
          for (const selector of selectors) {
            const el = document.querySelector(selector)
            if (el) return el
          }
          return null
        },
        
        clickElement: (selectors) => {
          const el = window.docmostHelper.findElement(selectors)
          if (el) {
            el.click()
            return true
          }
          return false
        },
        
        simulateKeydown: (key, modifiers = {}) => {
          const event = new KeyboardEvent('keydown', {
            key: key,
            code: key,
            keyCode: key.charCodeAt(0),
            which: key.charCodeAt(0),
            ctrlKey: modifiers.ctrl || false,
            metaKey: modifiers.meta || false,
            shiftKey: modifiers.shift || false,
            altKey: modifiers.alt || false,
            bubbles: true
          })
          document.activeElement.dispatchEvent(event)
          document.dispatchEvent(event)
        }
      }
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
      const currentZoom = webview.getZoomFactor()
      webview.setZoomFactor(Math.min(currentZoom + 0.1, 3))
      break
      
    case 'zoomOut':
      const zoom = webview.getZoomFactor()
      webview.setZoomFactor(Math.max(zoom - 0.1, 0.3))
      break
      
    case 'zoomReset':
      webview.setZoomFactor(1)
      break
      
    case 'goBack':
      if (webview.canGoBack()) {
        webview.goBack()
      }
      break
      
    case 'goForward':
      if (webview.canGoForward()) {
        webview.goForward()
      }
      break
      
    case 'quickSearch':
      webview.executeJavaScript(`
        (function() {
          const searchTriggers = [
            '[data-testid="search-trigger"]',
            '[aria-label="Search"]',
            'button[title="Search"]',
            '.search-trigger',
            '[class*="search"] button',
            'input[type="search"]'
          ]
          if (!window.docmostHelper.clickElement(searchTriggers)) {
            window.docmostHelper.simulateKeydown('k', { meta: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'goHome':
      webview.loadURL(DOCMOST_URL)
      break
      
    case 'newPage':
      webview.executeJavaScript(`
        (function() {
          const newPageTriggers = [
            '[data-testid="new-page-button"]',
            '[aria-label="New page"]',
            '[aria-label="Create page"]',
            'button[title="New page"]',
            '[class*="new-page"]',
            '[class*="create-page"]',
            '.sidebar-action-add'
          ]
          if (!window.docmostHelper.clickElement(newPageTriggers)) {
            window.docmostHelper.simulateKeydown('n', { meta: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'toggleSidebar':
      webview.executeJavaScript(`
        (function() {
          const sidebarToggles = [
            '[data-testid="sidebar-toggle"]',
            '[aria-label="Toggle sidebar"]',
            '[aria-label="Hide sidebar"]',
            '[aria-label="Show sidebar"]',
            'button[title="Toggle sidebar"]',
            '[class*="sidebar-toggle"]',
            '[class*="collapse-sidebar"]'
          ]
          if (!window.docmostHelper.clickElement(sidebarToggles)) {
            window.docmostHelper.simulateKeydown('\\\\', { meta: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'toggleComments':
      webview.executeJavaScript(`
        (function() {
          const commentToggles = [
            '[data-testid="comments-toggle"]',
            '[aria-label="Comments"]',
            '[aria-label="Toggle comments"]',
            'button[title="Comments"]',
            '[class*="comment-toggle"]',
            '[class*="comments-button"]'
          ]
          if (!window.docmostHelper.clickElement(commentToggles)) {
            window.docmostHelper.simulateKeydown('c', { meta: true, shift: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'focusMode':
      webview.executeJavaScript(`
        (function() {
          const sidebarToggles = [
            '[data-testid="sidebar-toggle"]',
            '[aria-label="Toggle sidebar"]',
            '[aria-label="Hide sidebar"]',
            'button[title="Toggle sidebar"]',
            '[class*="sidebar-toggle"]'
          ]
          window.docmostHelper.clickElement(sidebarToggles)
          
          const commentToggles = [
            '[data-testid="comments-toggle"]',
            '[aria-label="Comments"]',
            '[class*="comment-toggle"]'
          ]
          window.docmostHelper.clickElement(commentToggles)
        })()
      `).catch(() => {})
      break
      
    case 'insertMermaid':
      webview.executeJavaScript(`
        (function() {
          const mermaidTriggers = [
            '[data-testid="insert-mermaid"]',
            '[aria-label="Insert Mermaid"]',
            'button[title="Mermaid diagram"]',
            '[class*="mermaid"]'
          ]
          if (!window.docmostHelper.clickElement(mermaidTriggers)) {
            window.docmostHelper.simulateKeydown('m', { meta: true, shift: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'insertDrawio':
      webview.executeJavaScript(`
        (function() {
          const drawioTriggers = [
            '[data-testid="insert-drawio"]',
            '[aria-label="Insert Draw.io"]',
            'button[title="Draw.io diagram"]',
            '[class*="drawio"]'
          ]
          if (!window.docmostHelper.clickElement(drawioTriggers)) {
            window.docmostHelper.simulateKeydown('d', { meta: true, shift: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'insertExcalidraw':
      webview.executeJavaScript(`
        (function() {
          const excalidrawTriggers = [
            '[data-testid="insert-excalidraw"]',
            '[aria-label="Insert Excalidraw"]',
            'button[title="Excalidraw diagram"]',
            '[class*="excalidraw"]'
          ]
          if (!window.docmostHelper.clickElement(excalidrawTriggers)) {
            window.docmostHelper.simulateKeydown('e', { meta: true, shift: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'insertTable':
      webview.executeJavaScript(`
        (function() {
          const tableTriggers = [
            '[data-testid="insert-table"]',
            '[aria-label="Insert table"]',
            'button[title="Insert table"]',
            '[class*="table-insert"]'
          ]
          if (!window.docmostHelper.clickElement(tableTriggers)) {
            window.docmostHelper.simulateKeydown('t', { meta: true, shift: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'insertCodeBlock':
      webview.executeJavaScript(`
        (function() {
          const codeTriggers = [
            '[data-testid="insert-code"]',
            '[aria-label="Insert code block"]',
            'button[title="Code block"]',
            '[class*="code-block"]'
          ]
          if (!window.docmostHelper.clickElement(codeTriggers)) {
            window.docmostHelper.simulateKeydown('c', { meta: true, alt: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'insertCallout':
      webview.executeJavaScript(`
        (function() {
          const calloutTriggers = [
            '[data-testid="insert-callout"]',
            '[aria-label="Insert callout"]',
            'button[title="Callout"]',
            '[class*="callout"]'
          ]
          if (!window.docmostHelper.clickElement(calloutTriggers)) {
            window.docmostHelper.simulateKeydown('a', { meta: true, alt: true })
          }
        })()
      `).catch(() => {})
      break
      
    case 'sharePage':
      webview.executeJavaScript(`
        (function() {
          const shareTriggers = [
            '[data-testid="share-button"]',
            '[aria-label="Share"]',
            '[aria-label="Share page"]',
            'button[title="Share"]',
            '[class*="share-button"]',
            '[class*="share-trigger"]'
          ]
          window.docmostHelper.clickElement(shareTriggers)
        })()
      `).catch(() => {})
      break
      
    case 'copyLink':
      webview.executeJavaScript(`
        (function() {
          const url = window.location.href
          navigator.clipboard.writeText(url).then(() => {
            console.log('Link copied:', url)
          })
        })()
      `).catch(() => {})
      break
      
    case 'exportMarkdown':
      webview.executeJavaScript(`
        (function() {
          const exportTriggers = [
            '[data-testid="export-markdown"]',
            '[aria-label="Export as Markdown"]',
            'button[title="Export Markdown"]',
            '[class*="export-markdown"]'
          ]
          if (!window.docmostHelper.clickElement(exportTriggers)) {
            const menuTriggers = [
              '[data-testid="page-menu"]',
              '[aria-label="Page options"]',
              '[aria-label="Page menu"]',
              'button[title="More options"]',
              '[class*="page-menu"]'
            ]
            if (window.docmostHelper.clickElement(menuTriggers)) {
              setTimeout(() => {
                window.docmostHelper.clickElement(exportTriggers)
              }, 100)
            }
          }
        })()
      `).catch(() => {})
      break
      
    case 'exportHtml':
      webview.executeJavaScript(`
        (function() {
          const exportTriggers = [
            '[data-testid="export-html"]',
            '[aria-label="Export as HTML"]',
            'button[title="Export HTML"]',
            '[class*="export-html"]'
          ]
          if (!window.docmostHelper.clickElement(exportTriggers)) {
            const menuTriggers = [
              '[data-testid="page-menu"]',
              '[aria-label="Page options"]',
              '[aria-label="Page menu"]',
              'button[title="More options"]',
              '[class*="page-menu"]'
            ]
            if (window.docmostHelper.clickElement(menuTriggers)) {
              setTimeout(() => {
                window.docmostHelper.clickElement(exportTriggers)
              }, 100)
            }
          }
        })()
      `).catch(() => {})
      break
      
    case 'showShortcuts':
      webview.executeJavaScript(`
        (function() {
          const helpTriggers = [
            '[data-testid="keyboard-shortcuts"]',
            '[aria-label="Keyboard shortcuts"]',
            'button[title="Shortcuts"]',
            '[class*="shortcuts"]'
          ]
          window.docmostHelper.clickElement(helpTriggers)
        })()
      `).catch(() => {})
      break
      
    case 'showAbout':
      webview.executeJavaScript(`
        (function() {
          const aboutTriggers = [
            '[data-testid="about"]',
            '[aria-label="About"]',
            '[class*="about"]'
          ]
          window.docmostHelper.clickElement(aboutTriggers)
        })()
      `).catch(() => {})
      break
      
    default:
      console.log('Unknown action:', action)
  }
}
