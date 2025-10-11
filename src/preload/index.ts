import { contextBridge, ipcRenderer } from 'electron'

const api = {
  setToken:(token:string) => ipcRenderer.invoke('set-token',token),
  getToken:() => ipcRenderer.invoke('get-token'),
  removeToken:() => ipcRenderer.invoke('remove-token'),
  openWindow:(route:string) => ipcRenderer.send('open-window',route), 
  removeWindow:(route:string) => ipcRenderer.send('close-window',route),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {

  // @ts-ignore (define in dts)
  window.electron = api
  // @ts-ignore (define in dts)
  window.api = api
}