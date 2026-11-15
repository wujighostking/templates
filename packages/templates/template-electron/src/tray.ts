import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'

// macOS 使用纯黑模板图标（系统会自动适配深浅色菜单栏），Windows/Linux 使用白色图标
// 每种图标提供 16px（1x）与 32px（@2x）两个分辨率
const TRAY_ICON_BLACK_1X =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVR42mNgoCH4j4bJ1kiSQf+JxBRpxmkIRQb8JxMPJwMGPhaokpCokpSpkplIAgCrxJNtql+DvQAAAABJRU5ErkJggg=='
const TRAY_ICON_BLACK_2X =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATUlEQVR42u2XwQkAQAjD3H/p3gqCeK2QQN/Nz1oFx1AztuIVEQ1jKx6LWAW0FGt5W8IqoE9BAAEEEMgV4BZEnGMWUcwojZnlEY8JrPEAL8kt79Zi6fQAAAAASUVORK5CYII='
const TRAY_ICON_WHITE_1X =
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVR42mNgoBX4jwbI1kiSQf+JBBRpxmkIRQb8JxMMJwMGPhaokpCokpSpkplIBQAXwk3PZPWTtwAAAABJRU5ErkJggg=='
const TRAY_ICON_WHITE_2X =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAATElEQVR42u3XwQkAQAgDQftvOteCIF4i7Dbg/NQqupSa2QavQDTMNngMsQK0lHV4G2EF6FMAAAAAkAtgF0SsYy6imKM05iyPeExosweiZ7e5v021XwAAAABJRU5ErkJggg=='

let tray: Tray | null = null

function showMainWindow(getWindow: () => BrowserWindow | null): void {
  const win = getWindow()
  if (!win) return
  win.show()
  win.focus()
}

function toggleMainWindow(getWindow: () => BrowserWindow | null): void {
  const win = getWindow()
  if (!win) return
  if (win.isVisible()) {
    win.hide()
  } else {
    showMainWindow(getWindow)
  }
}

/**
 * 创建系统托盘，通过 getWindow 动态获取主窗口引用。
 */
export function createTray(getWindow: () => BrowserWindow | null): Tray {
  const isMac = process.platform === 'darwin'
  const base = isMac ? TRAY_ICON_BLACK_1X : TRAY_ICON_WHITE_1X
  const retina = isMac ? TRAY_ICON_BLACK_2X : TRAY_ICON_WHITE_2X
  const icon = nativeImage.createEmpty()
  icon.addRepresentation({ scaleFactor: 1, dataURL: `data:image/png;base64,${base}` })
  icon.addRepresentation({ scaleFactor: 2, dataURL: `data:image/png;base64,${retina}` })
  if (isMac) {
    icon.setTemplateImage(true)
  }

  tray = new Tray(icon)
  tray.setToolTip('Template Electron')

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '显示主窗口',
        click: () => showMainWindow(getWindow),
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => app.quit(),
      },
      {
        label:'打开开发者工具',
        click: () => {
          const win = getWindow()
          if (win) {
            win.webContents.openDevTools({ mode: 'detach' })
          }
        }
      }
    ]),
  )

  // 单击托盘图标：切换主窗口显示/隐藏
  tray.on('click', () => toggleMainWindow(getWindow))

  return tray
}
