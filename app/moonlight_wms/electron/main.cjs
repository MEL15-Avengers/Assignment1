const { app, BrowserWindow, shell, Menu } = require('electron')
const path = require('path')
const { URL } = require('url')

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    icon: path.join(__dirname, 'icon.ico'),
    title: 'Moonlight WMS',
    show: false,
    backgroundColor: '#0d1117',
    titleBarStyle: 'default',
  })

  // Show when ready to prevent white flash
  win.once('ready-to-show', () => {
    win.show()
    if (isDev) win.webContents.openDevTools({ mode: 'detach' })
  })

  if (isDev) {
    // Dev mode: load from Vite dev server
    win.loadURL('http://localhost:5173')
  } else {
    // Production: load built files
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Open external links in default browser, not in Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Custom menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => win.reload() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => win.webContents.setZoomLevel(win.webContents.getZoomLevel() + 0.5) },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => win.webContents.setZoomLevel(win.webContents.getZoomLevel() - 0.5) },
        { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => win.webContents.setZoomLevel(0) },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', click: () => win.setFullScreen(!win.isFullScreen()) },
        ...(isDev ? [{ type: 'separator' }, { label: 'Dev Tools', accelerator: 'F12', click: () => win.webContents.toggleDevTools() }] : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About Moonlight WMS', click: () => {
          const { dialog } = require('electron')
          dialog.showMessageBox(win, {
            type: 'info',
            title: 'About Moonlight WMS',
            message: 'Moonlight Grocery WMS\nVersion 1.0.0\n\nGrocery Inventory Warehouse Management System',
            buttons: ['OK'],
          })
        }},
      ],
    },
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
