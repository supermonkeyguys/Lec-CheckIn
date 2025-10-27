import { desktopCapturer, ipcMain } from 'electron'
import { createAppWindow, minimizeWindow, removeWindow } from './windowsManager'

export function registerWindowHandlers() {
  ipcMain.on('open-window', (_, route: string) => {
    createAppWindow(route, route)
  })
  ipcMain.on('close-window', (_, name: string): boolean => {
    return removeWindow(name)
  })
  ipcMain.on('minimize-window', (_, name: string): boolean => {
    return minimizeWindow(name)
  })

  ipcMain.handle('get-desktop-sources', async () => {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 300, height: 200 }
    })

    return sources.map((source) => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL()
    }))
  })
}
