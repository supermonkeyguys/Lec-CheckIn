import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  setToken:(token:string) => ipcRenderer.invoke('set-token',token),
  getToken:() => ipcRenderer.invoke('get-token'),
  removeToken:() => ipcRenderer.invoke('remove-token'),
  openWindow:(route:string) => ipcRenderer.send('open-window',route), 
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: {
        send: (channel, ...args) => ipcRenderer.send(channel, args)
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
