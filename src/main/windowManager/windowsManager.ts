import { BrowserWindow } from 'electron'
import path from 'path'

const windows = new Map<string, BrowserWindow>()

export function createAppWindow(name: string, route: string) {
  if (windows.has(name)) {
    const existing = windows.get(name)!
    existing.focus()
    return existing
  }

  const width = name === '/home' ? 1000 : 1400;
  const height = name === '/home' ? 700 : 900;

  const preloadPath = path.join(__dirname, '../preload/index.cjs')

  const win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    resizable: false,
    icon:path.join(__dirname, '../build//icon.ico'),
    webPreferences: {
      allowRunningInsecureContent:true,
      nodeIntegration:false,
      contextIsolation:true,
      preload: preloadPath,
      sandbox:false
    }
  })

  if (process.env.NODE_ENV === 'development') {
    process.env.VITE_DEV_SERVER_URL = 'http://localhost:5137'
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}/#${route}`)
    console.log(`${process.env.VITE_DEV_SERVER_URL}/#${route}`)
  } else {
    win.loadFile(
      path.join(__dirname, '../renderer/index.html'),
      { hash: route }
    )
  }

  win.on('closed', () => {
    windows.delete(name)
  })

  windows.set(name, win)

  return win
}

export function removeWindow(name:string):boolean{
  const win = windows.get(name) 
  if(win) {
    win.close()
    return true
  }

  return false
}

export function minimizeWindow(name:string) {
  const win = windows.get(name)
  if(win) {
    win.minimize()
    return true
  }

  return false
} 