import { app,  ipcMain } from 'electron'
import { createAppWindow, removeWindow } from './windowsManager'
import { getToken, removeToken, setToken } from './tokenManage'
import { registerTimerHandlers } from './ipcHandlers'


app.whenReady().then(() => {
  registerTimerHandlers()
  createAppWindow('/', '/')
})

ipcMain.on('open-window', (event, route: string) => {
  createAppWindow(route, route)
})
ipcMain.on('close-window',(event,name:string):boolean => {
  return removeWindow(name)
})

// token Manager
ipcMain.handle('set-token', async (event, token: string): Promise<boolean> => {
  await setToken(token)
  return true
})
ipcMain.handle('get-token', async (): Promise<string | null> => {
  const token = await getToken()
  return token
})
ipcMain.handle('remove-token', async (): Promise<boolean> => {
  await removeToken()
  return true
})
