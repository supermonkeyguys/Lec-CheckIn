import { BrowserWindow } from 'electron'
import path from 'path'

const windows = new Map<string, BrowserWindow>()

export function createAppWindow(name: string, route: string) {
  if (windows.has(name)) {
    const existing = windows.get(name)!
    existing.focus()
    return existing
  }

  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  const baseUrl =
    process.env.VITE_DEV_SERVER_URL || `${path.join(__dirname, '../../src/renderer/index.html')}`

  console.log(process.env['VITE_DEV_SERVER_URL'])
  console.log('=== ENV DEBUG START ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('VITE_DEV_SERVER_URL:', process.env.VITE_DEV_SERVER_URL)
  console.log('CWD:', process.cwd())
  console.log('=== ENV DEBUG END ===')
  console.log('process: ', process.env.VITE_DEV_SERVER_URL)
  console.log(baseUrl)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${baseUrl}`)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: route
    })
  }

  win.on('closed', () => {
    windows.delete(name)
  })

  windows.set(name, win)

  return win
}
