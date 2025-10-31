import { app } from 'electron'
import { createAppTray, createAppWindow } from './windowManager/windowsManager'
import { registerTimerHandlers } from './checkInManager/ipcHandlers'
import { getActiveUser, getStoredToken, registerLogHandler, registerTokenHandler } from './tokenManager/tokenHandler'
import { verifyToken } from './utils/verifyToken'
import { registerSettingHandlers } from './SettingManager/ipcHandler'
import { registerWindowHandlers } from './windowManager/ipcHandler'
import { registerBackgroundHandlers } from './backgroundService/ipcHandler'
import crypto from 'crypto'
import { sessionManager } from './session/sessionManager'
import { backgroundManager } from './backgroundService/backgroundManager'
import { registerVerifyIPHandler } from './utils/verifyIp'

app.whenReady().then(async () => {
  registerWindowHandlers()
  registerTimerHandlers()
  registerTokenHandler()
  registerSettingHandlers()
  registerBackgroundHandlers()
  registerLogHandler()
  registerVerifyIPHandler()

  let route = '/home'
  const username = getActiveUser()
  const { token, remember } = getStoredToken(username)

  if (token && remember) {
    try {
      const res = await verifyToken(token)
      ensureSessionForToken(token,res.username)
      backgroundManager.restoreFromSettings()
      if (res.valid) route = '/clock/clockIn'
    } catch (err) {
      console.warn('Token 无效')
    }
  }

  createAppWindow(route, route)
  createAppTray()
})

function ensureSessionForToken(serverToken: string, username: string) {
  const localToken = crypto.createHash('sha256').update(serverToken).digest('hex')
  const active = sessionManager.getActive()
  if(active?.token !==  localToken) {
    backgroundManager.resetForNewSession()
    sessionManager.loginWithFixedToken(localToken,username)
  }
}
