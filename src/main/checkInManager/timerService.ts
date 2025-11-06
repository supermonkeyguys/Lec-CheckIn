import { BrowserWindow, Notification } from 'electron'
import { clearInterval } from 'timers'
import { UserStore } from '../user/userContext'


interface ReminderState {
  lastElapsedTime: number
  lastNotifyAt: number | null
  hasSentWarning: boolean
}

export const reminderState: ReminderState = {
  lastElapsedTime:0,
  lastNotifyAt: null,
  hasSentWarning: false,
}

const DEFAULT_REMINDER_TIME_MS = 3 * 60 * 60 * 1000   
const DEFAULT_REMINDER_INTERVAL_MS = 10 * 60 * 1000  

let reminderCheckInterval:NodeJS.Timeout | null = null

export const syncTimerState = (elapsedTime:number) => {
  reminderState.lastElapsedTime = elapsedTime

  if(!reminderCheckInterval) {
    reminderCheckInterval = setInterval(() => {
      checkAndSendWaring()
    },30_000)
  }

  checkAndSendWaring()
}

export const stopReminderService = () => {
  if(reminderCheckInterval) {
    clearInterval(reminderCheckInterval)
    reminderCheckInterval = null
  }

  reminderState.lastElapsedTime = 0
  reminderState.hasSentWarning = false
  reminderState.lastNotifyAt = null
}


export const checkAndSendWaring = () => {
  const s = UserStore.load() || {}
  const reminderTime =
    typeof s.reminderTime === 'number' && s.reminderTime > 0
      ? s.reminderTime
      : DEFAULT_REMINDER_TIME_MS
  const reminderInterval =
    typeof s.reminderInterval === 'number' && s.reminderInterval > 0
      ? s.reminderInterval
      : DEFAULT_REMINDER_INTERVAL_MS

  const elapsed = reminderState.lastElapsedTime

  if (elapsed < reminderTime)return

  const now = Date.now() 
  const allowFirst = !reminderState.hasSentWarning
  const allowInterval = reminderState.lastNotifyAt
    ? (now - reminderState.lastNotifyAt) >= reminderInterval
    : true

  if(!(allowFirst || allowInterval)) return

  if (Notification.isSupported()) {
    const notification = new Notification({
      title: '⏰ 打卡提醒',
      body: `您已打卡 ${(elapsed / (60 * 1000)).toFixed(1)} 分钟，\n即将达到今日上限 (5小时), 请及时提交! `,
      silent: false
    })

    notification.show()
    notification.on('click', () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) {
        win.show()
        win.focus()
      }
    })
  }

  reminderState.hasSentWarning = true
  reminderState.lastNotifyAt = now
}
