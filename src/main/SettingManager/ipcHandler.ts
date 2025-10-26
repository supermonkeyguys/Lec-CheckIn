import { ipcMain } from 'electron'
import { UserSetting, UserStore } from '../user/userContext'

export function registerSettingHandlers() {
  ipcMain.handle('get-user-setting', () => {
    return UserStore.load()
  })
  ipcMain.handle('update-user-setting', async (_, patch: Partial<UserSetting>) =>
    UserStore.save(patch)
  )
  ipcMain.handle('clear-user-setting', async () => {
    UserStore.clear()
    return { success: true }
  })
}
