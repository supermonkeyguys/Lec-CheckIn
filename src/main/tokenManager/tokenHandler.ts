import { ipcMain } from 'electron'
import { default as Store } from 'electron-store'
import crypto from 'crypto'
import { backgroundManager } from '../backgroundService/backgroundManager'
import { sessionManager } from '../session/sessionManager'
import { stopTimer } from '../checkInManager/timerService'

const store = new Store()

export function registerTokenHandler() {
  ipcMain.handle('set-token', async (_, token: string, remember) => {
    store.set('authToken', token)
    store.set('autoLogin', remember)
    return true
  })

  ipcMain.handle('get-token', async (_, username: string) => {
    return {
      token: store.get(`account.${username}.authToken`),
      remember: store.get(`account.${username}.autoLogin`)
    }
  })

  ipcMain.handle('remove-token', async () => {
    store.delete('authToken')
    store.delete('autoLogin')
    return true
  })
}

export function getStoredToken(username: string) {
  return {
    token: store.get(`account.${username}.authToken`) as string | undefined,
    remember: store.get(`account.${username}.autoLogin`) as boolean | undefined
  }
}

export function registerLogHandler() {
  ipcMain.handle(
    'user-login',
    async (_, payload: { token: string; username: string; remember: Boolean }) => {
      const { token, username, remember } = payload

      const localToken = crypto.createHash('sha256').update(token).digest('hex')
      backgroundManager.resetForNewSession()
      sessionManager.loginWithFixedToken(localToken, username || '666')

      store.set(`account.${username}.authToken`, token)
      store.set(`account.${username}.autoLogin`, remember)
      setActiveUser(username)

      return { success: true, message: '登录成功' }
    }
  )

  ipcMain.handle('user-logout', async (_, username: string) => {
    stopTimer()
    backgroundManager.resetForNewSession()
    sessionManager.logout()

    store.delete(`account.${username}.authToken`)
    store.delete(`account.${username}.autoLogin`)

    return { success: true, message: '成功退出' }
  })
}

export function setActiveUser(username: string) {
  store.set('activeUser', username)
}
export function getActiveUser() {
  return store.get('activeUser') as string
}
