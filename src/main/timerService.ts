import { BrowserWindow, Notification } from 'electron'
import { performance } from 'perf_hooks'
import { clearInterval } from 'timers'

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

const MAX_DURATION_MS = 1 * 60 * 1000
const WARNING_THRESHOLD_MS = 30 * 60 * 1000

let hasSentWaring = false
let waringCheckInterval:NodeJS.Timeout | null = null

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

  if(!waringCheckInterval) {
    console.log(11111)
    waringCheckInterval = setInterval(() => {
        checkAndSendWaring()
    },10_000)
  }
}

export const stopTimer = () => {
  timerState.isRunning = false
  timerState.startTime = null
  timerState.accumulatedTime = 0
  timerState.currentWindowId = null

  if(waringCheckInterval) {
    clearInterval(waringCheckInterval)
    waringCheckInterval = null
  }
  hasSentWaring = false
}

export const checkAndSendWaring = () => {
  if (hasSentWaring) return

  const elapsed = getElapsedTime()
  const remaining = MAX_DURATION_MS - elapsed

  if (remaining <= WARNING_THRESHOLD_MS && remaining > 0) {
    hasSentWaring = true
  }

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

}
