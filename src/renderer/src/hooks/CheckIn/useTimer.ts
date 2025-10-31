import { startCheckInState } from '@renderer/services/clock'
import { StateType } from '@renderer/store'
import { setStartTime } from '@renderer/store/clockReducer'
import { message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type TimerStatus = {
  currentTime: number
  isRunning: boolean
}

export const STARTTIME_KEY = 'checkInStartTime'

export function useTimer() {
  const dispatch = useDispatch()
  const startTime = useSelector((state: StateType) => state.checkIn.startTime)
  const [status, setStatus] = useState<TimerStatus>({
    currentTime: 0,
    isRunning: false
  })

  const statusRef = useRef(status)
  statusRef.current = status

  const syncWithMain = async () => {
    try {
      const [isRunning, currentTime] = await Promise.all([
        window.electronAPI?.isRunning(),
        window.electronAPI?.getElapsedTime()
      ])
      setStatus({ isRunning: !!isRunning, currentTime: currentTime || 0 })
    } catch (err) {
      console.warn('Failed to sync timer:', err)
    }
  }

  const start = async () => {
    const inTargetNetwork = await window.electronAPI?.checkTargetNetwork()
    await startCheckInState(new Date().toISOString())

    if(!inTargetNetwork) { 
      message.error('请在团队内打卡')
      return;
    }

    const startTime = new Date().toISOString()
    dispatch(setStartTime(startTime))
    localStorage.setItem(STARTTIME_KEY, startTime)
    await window.electronAPI?.startTimer()
    await syncWithMain()
  }

  const stop = async () => {
    const finalTime = await window.electronAPI?.stopTimer()
    setStatus({ currentTime: finalTime || 0, isRunning: false })
    await syncWithMain()
  }

  const clear = () => {
    setStatus({ currentTime: 0, isRunning: false })
  }

  useEffect(() => {
    const saved = localStorage.getItem(STARTTIME_KEY)
    if (saved) {
      const d = new Date(saved)
      if (!isNaN(d.getTime())) {
        dispatch(setStartTime(saved))
      } else {
        localStorage.removeItem(STARTTIME_KEY)
      }
    }

    syncWithMain()

    const interval = setInterval(() => {
      if (statusRef.current.isRunning) {
        window.electronAPI?.getElapsedTime().then((t: number) => {
          setStatus((prev) => ({ ...prev, currentTime: t || 0 }))
        })
      }
    }, 10)

    return () => clearInterval(interval)
  }, [])

  return {
    ...status,
    start,
    stop,
    startTime,
    clear
  }
}
