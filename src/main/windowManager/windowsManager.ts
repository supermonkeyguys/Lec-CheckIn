import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import path from 'path'

const windows = new Map<string, BrowserWindow>()
let appTray: Tray | null = null
let isQuit = false

type WinHandlers = {
  close?: (e: Electron.Event) => void
  show?: () => void
  hide?: () => void
}

const winHandlers = new Map<string, WinHandlers>()

export function removeWindow(name: string): boolean {
  const win = windows.get(name)
  if (win && !win.isDestroyed()) {
    win.close()
    return true
  }
  return false
}

export function minimizeWindow(name: string): boolean {
  const win = windows.get(name)
  if (win && !win.isDestroyed()) {
    win.minimize()
    return true
  }
  return false
}

export function createAppWindow(name: string, route: string) {
  if (windows.has(name)) {
    const existing = windows.get(name)!
    if (!existing.isDestroyed()) {
      if (existing.isMinimized()) existing.restore()
      if (!existing.isVisible()) existing.show()
      existing.focus()
      return existing
    }
  }

  const width = name === '/home' ? 1000 : 1400
  const height = name === '/home' ? 700 : 900

  const preloadPath = path.join(__dirname, '../preload/index.cjs')

  const win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    resizable: false,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      webSecurity:false,
      allowRunningInsecureContent: true,
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      sandbox: false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    process.env.VITE_DEV_SERVER_URL = 'http://localhost:5137'
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/#${route}`)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: route })
  }

  if (name === '/clock/clockIn' || name === '/home') {
    win.on('close', (e) => {
      if (!isQuit) {
        e.preventDefault()
        win.hide()
      }
    })
  }

  win.on('closed', () => {
    windows.delete(name)
    winHandlers.delete(name)
  })

  windows.set(name, win)
  return win
}

function showAndFocusWindow(win: BrowserWindow) {
  if (win.isMinimized()) win.restore()
  if (!win.isVisible()) win.show()
  win.focus()
}

export function createAppTray() {
  if (appTray) return appTray

  const iconPath = path.join(__dirname, '../build/icon.ico')
  const trayIcon = nativeImage.createFromPath(iconPath)
  appTray = new Tray(trayIcon)
  appTray.setToolTip('LecCheckIn')

  const openMainWindow = () => {
    const home = windows.get('/home')
    const clockIn = windows.get('/clock/clockIn')
    if (clockIn && !clockIn.isDestroyed()) {
      showAndFocusWindow(clockIn)
    } else if (home && !home.isDestroyed()) {
      showAndFocusWindow(home)
    } else {
      createAppWindow('/home', '/home')
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: openMainWindow
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      click: () => {
        isQuit = true

        // 关闭所有窗口
        windows.forEach((win) => {
          if (win && !win.isDestroyed()) {
            win.close()
          }
        })

        // 清理 tray
        if (appTray && !appTray.isDestroyed()) {
          try {
            appTray.destroy()
          } catch (err) {
            console.error('销毁托盘图标失败:', err)
          }
          appTray = null
        }

        app.quit()
      }
    }
  ])

  appTray.setContextMenu(contextMenu)
  appTray.on('click', openMainWindow)

  return appTray
}
