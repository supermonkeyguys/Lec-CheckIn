import { app, ipcMain } from "electron";
import { createAppWindow } from "./windowsManager";
import { getToken, removeToken, setToken } from "./tokenManage";

app.whenReady().then(() => {
  createAppWindow('main',"/")
})


ipcMain.on("open-window",(event,route:string) => {
  createAppWindow(route,route)
})

// token Manager
ipcMain.handle('set-token',async (event,token:string):Promise<boolean> => {
  await setToken(token)
  return true
})
ipcMain.handle('get-token',async ():Promise<string | null> => {
  const token = await getToken()
  return token 
})
ipcMain.handle('remove-token',async ():Promise<boolean> => {
  await removeToken()
  return true
})