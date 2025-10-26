import { BrowserWindow, Notification } from 'electron'
import { performance } from 'perf_hooks'
import { clearInterval } from 'timers'
import { UserStore } from '../user/userContext'


interface TimerState {
  isRunning: boolean
  startTime: number | null
  accumulatedTime: number
  currentWindowId: number | null
}

export const timerState: TimerState = {
  isRunning: false,
  startTime: null,
  accumulatedTime: 0,
  currentWindowId: null
}

const DEFAULT_REMINDER_TIME_MS = 3 * 60 * 60 * 1000   
const DEFAULT_REMINDER_INTERVAL_MS = 10 * 60 * 1000  

let hasSentWaring = false
let waringCheckInterval: NodeJS.Timeout | null = null
let lastNotifyAt: number | null = null

export const getElapsedTime = (): number => {
  if (!timerState.isRunning || timerState.startTime === null) {
    return timerState.accumulatedTime
  }
  return timerState.accumulatedTime + (performance.now() - timerState.startTime)
}

export const startTimer = (windowId: number) => {
  if (timerState.isRunning) return
  timerState.isRunning = true
  timerState.startTime = performance.now()
  timerState.currentWindowId = windowId

  lastNotifyAt = null
  hasSentWaring = false

  if (!waringCheckInterval) {
    waringCheckInterval = setInterval(() => {
      checkAndSendWaring()
    }, 30_000)
  }
}

export const stopTimer = () => {
  timerState.isRunning = false
  timerState.startTime = null
  timerState.accumulatedTime = 0
  timerState.currentWindowId = null

  if (waringCheckInterval) {
    clearInterval(waringCheckInterval)
    waringCheckInterval = null
  }
  hasSentWaring = false
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

  const elapsed = getElapsedTime()

  if (elapsed < reminderTime)return

  const now = Date.now() 
  const allowFirst = !hasSentWaring
  const allowInterval = lastNotifyAt
    ? (now - lastNotifyAt) >= reminderInterval
    : true

  if(!(allowFirst || allowInterval)) return

  if (Notification.isSupported()) {
    const notification = new Notification({
      title: '⏰ 打卡提醒',
      body: `您已打卡 ${(elapsed / (60 * 1000)).toFixed(1)} 分钟，\n即将达到今日上限 (8小时), 请及时提交! `,
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

  hasSentWaring = true
  lastNotifyAt = now
}
