import { getCurrentCheckInState } from '@renderer/services/user'
import { setStartTime } from '@renderer/store/clockReducer'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

type TimerStatus = {
  currentTime: number
  isRunning: boolean
}

export const STARTTIME_KEY = 'checkInStartTime'

export function useTimer() {
  const dispatch = useDispatch()
  const [status, setStatus] = useState<TimerStatus>({
    currentTime: 0,
    isRunning: false
  })

  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastRenderTimeRef = useRef<number>(0)
  const isRunningRef = useRef<boolean>(false)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const syncToInterval = () => {
    if (startTimeRef.current !== null) {
      const elapsed = Date.now() - startTimeRef.current
      window.electronAPI?.timerSync(elapsed)
    }
  }

  const tick = () => {
    if (!isRunningRef.current || startTimeRef.current === null) return

    const now = Date.now()
    const elapsed = now - startTimeRef.current

    if (now - lastRenderTimeRef.current >= 16) {
      setStatus({
        currentTime: elapsed,
        isRunning: true
      })
      lastRenderTimeRef.current = now
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const startTimer = (startTime: number) => {
    startTimeRef.current = startTime
    isRunningRef.current = true
    lastRenderTimeRef.current = Date.now() - 100
    rafRef.current = null
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick)
    }

    if (syncIntervalRef.current === null) {
      syncIntervalRef.current = setInterval(syncToInterval, 10_000)
      syncToInterval()
    }
  }

  const stopTimer = () => {
    isRunningRef.current = false
    startTimeRef.current = null
    localStorage.removeItem(STARTTIME_KEY)
    setStatus({ currentTime: 0, isRunning: false })
    dispatch(setStartTime(''))
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (syncIntervalRef.current !== null) {
      clearInterval(syncIntervalRef.current)
      syncIntervalRef.current = null
    }
    window.electronAPI?.timerStopReminder()
  }

  const restoreTimer = async () => {
    let startTime: number | null = null
    const local = localStorage.getItem(STARTTIME_KEY)
    if (local) {
      startTime = new Date(local).getTime()
    }

    if (startTime === null) {
      const { isCheckIn, startTime: currentStartTime } = await getCurrentCheckInState()
      if (isCheckIn && currentStartTime) {
        startTime = new Date(currentStartTime).getTime()
        localStorage.setItem(STARTTIME_KEY, currentStartTime)
        dispatch(setStartTime(currentStartTime))
      }
    }

    if (startTime != null) {
      startTimer(startTime)
    } else {
      stopTimer()
    }
  }

  useEffect(() => {
    restoreTimer()
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      if (syncIntervalRef.current !== null) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [])

  return {
    ...status,
    startTimer,
    stopTimer,
    restoreTimer
  }
}
