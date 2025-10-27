const { contextBridge, ipcRenderer } = require('electron')

const api = {
  setToken: (token: string, remember: boolean) => ipcRenderer.invoke('set-token', token, remember),
  getToken: (username: string) => ipcRenderer.invoke('get-token', username),
  removeToken: () => ipcRenderer.invoke('remove-token'),
  openWindow: (route: string) => ipcRenderer.send('open-window', route),
  removeWindow: (route: string) => ipcRenderer.send('close-window', route),
  minimizeWindow: (route: string) => ipcRenderer.send('minimize-window', route),
  startTimer: () => ipcRenderer.invoke('timer-start'),
  stopTimer: () => ipcRenderer.invoke('timer-stop'),
  getElapsedTime: () => ipcRenderer.invoke('timer-get'),
  isRunning: () => ipcRenderer.invoke('timer-isRunning'),

  userLogin: (credentials) => ipcRenderer.invoke('user-login', credentials),
  userLogout: (username: string) => ipcRenderer.invoke('user-logout', username),
  setBackgroundVideo: (filePath) => ipcRenderer.invoke('set-background-video', filePath),
  setBackgroundImage: (filePath) => ipcRenderer.invoke('set-background-image', filePath),
  getCurrentBackground: () => ipcRenderer.invoke('get-current-background'),
  showOpenDialog: (options: any) => ipcRenderer.invoke('show-open-dialog', options),

  getUserSetting: () => ipcRenderer.invoke('get-user-setting'),
  updateUserSetting: (s: any) => ipcRenderer.invoke('update-user-setting', s),
  clearUserSetting: () => ipcRenderer.invoke('clear-user-setting'),

  getDesktopSources: async () => ipcRenderer.invoke('get-desktop-sources'),

  getBgVideoBuffer: async () => ipcRenderer.invoke('get-background-video-buffer'),
  getBgImageBuffer: async () => ipcRenderer.invoke('get-background-image-buffer')
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
