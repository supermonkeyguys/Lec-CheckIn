import { ElectronAPI } from '@electron-toolkit/preload'

export interface UserSetting {
  reminderTime?: number
  reminderInterval?: number
  backgroundType?: 'none' | 'image' | 'video'
  backgroundImageSrc?: string
  backgroundVideoSrc?: string
  updatedAt?: number
}

declare global {
  interface Window {
    electronAPI?: {
      openWindow: (route: string) => void
      removeWindow: (route: string) => void
      minimizeWindow: (route: string) => void
      setToken: (token: string, remember: boolean) => Promise<boolean>
      getToken: (username: string) => Promise<any>
      removeToken: () => Promise<boolean>

      timerSync: (elapsed: number) => Promise<boolean>
      timerStopReminder: () => Promise<boolean>

      userLogin: (payload: { token: string; username: string; remember: boolean }) => {
        success: boolean
        message?: string
      }
      userLogout: (username: string) => Promise<boolean>
      setBackgroundVideo: (
        filePath: string
      ) => Promise<{ success: boolean; optimizedPath?: string; error?: string }>
      setBackgroundImage: (
        filePath: string
      ) => Promise<{ success: boolean; optimizedPath?: string; error?: string }>
      getCurrentBackground: () => string | null
      showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string }>

      getUserSetting: () => Promise<UserSetting>
      updateUserSetting: (setting: Partial<UserSetting>) => Promise<UserSetting>
      clearUserSetting: () => Promise<void>

      getDesktopSources: () => Promise<any>

      getBgVideoBuffer: () => Promise<any>
      getBgImageBuffer: () => Promise<any>

      checkTargetNetwork: () => Promise<boolean>

      onUpdateAvailable: (cb: (version: string) => void) => () => void
      onUpdateDownloaded: (cb: (version: string) => void) => () => void
      installUpdate: () => void
    }
  }
}

export {}
