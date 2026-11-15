import { app, BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { createTray } from './tray'

let mainWindow: BrowserWindow | null = null
let isQuitting = false

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: 'Template Electron',
    backgroundColor: '#1e1e2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow = win

  win.once('ready-to-show', () => {
    win.show()
  })

  // 关闭窗口时最小化到系统托盘，而不是退出应用
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      win.hide()
    }
  })

  // 外部链接交给系统默认浏览器打开，而不是新开 Electron 窗口
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 8.163.129.27:1024
  win.loadURL('http://localhost:5173')
  win.webContents.openDevTools({ mode: 'detach' })
}

app.whenReady().then(() => {
  createWindow()
  createTray(() => mainWindow)

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show()
    } else {
      createWindow()
    }
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
