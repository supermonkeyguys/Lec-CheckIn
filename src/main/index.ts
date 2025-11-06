import { app, BrowserWindow, ipcMain } from 'electron'
import { createAppTray, createAppWindow } from './windowManager/windowsManager'
import { registerTimerHandlers } from './checkInManager/ipcHandlers'
import {
  getActiveUser,
  getStoredToken,
  registerLogHandler,
  registerTokenHandler
} from './tokenManager/tokenHandler'
import { verifyToken } from './utils/verifyToken'
import { registerSettingHandlers } from './SettingManager/ipcHandler'
import { registerWindowHandlers } from './windowManager/ipcHandler'
import { registerBackgroundHandlers } from './backgroundService/ipcHandler'
import crypto from 'crypto'
import { sessionManager } from './session/sessionManager'
import { backgroundManager } from './backgroundService/backgroundManager'
import { registerVerifyIPHandler } from './utils/verifyIp'
import { autoUpdater } from 'electron-updater'

const gotTheLock = app.requestSingleInstanceLock()
let mainWindow: BrowserWindow | null = null

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const win = windows[0]
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })


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
        ensureSessionForToken(token, res.username)
        backgroundManager.restoreFromSettings()
        if (res.valid) route = '/clock/clockIn'
      } catch (err) {
        console.warn('Token 无效')
      }
    }

    mainWindow = createAppWindow(route, route)
    createAppTray()
  })
}

function ensureSessionForToken(serverToken: string, username: string) {
  const localToken = crypto.createHash('sha256').update(serverToken).digest('hex')
  const active = sessionManager.getActive()
  if (active?.token !== localToken) {
    backgroundManager.resetForNewSession()
    sessionManager.loginWithFixedToken(localToken, username)
  }
}

autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...');
});

autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version);
  mainWindow?.webContents.send('update-available', info.version);
});

autoUpdater.on('update-not-available', () => {
  console.log('当前已是最新版本');
});

autoUpdater.on('error', (err) => {
  console.error('自动更新出错:', err.message);
});

autoUpdater.on('download-progress', (progressObj) => {
  const { percent, transferred, total } = progressObj;
  console.log(`下载进度: ${percent.toFixed(2)}% (${transferred}/${total})`);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('更新已下载完成');
  mainWindow?.webContents.send('update-downloaded', info.version);
});


ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});
