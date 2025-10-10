export interface WindowManager {
  openWindow: (route: string) => void
  setToken: (token: string) => Promise<boolean>
  getToken: () => Promise<string | null>
  removeToken: () => Promise<boolean>
}

declare global {
  interface Window {
    electronAPI: WindowManager
  }
}

export {}
