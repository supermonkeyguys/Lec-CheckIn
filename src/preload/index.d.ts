import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electronAPI?: {
      openWindow: (route: string) => void
      removeWindow: (route: string) => void
      setToken: (token: string) => Promise<boolean>
      getToken: () => Promise<string | null>
      removeToken: () => Promise<boolean>
      startTimer:() => Promise<void> 
      stopTimer:() => Promise<number>
      getElapsedTime:() => Promise<number> 
      isRunning:() => Promise<boolean>
    }
  }
}

export {}

