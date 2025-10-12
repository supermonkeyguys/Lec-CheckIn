import { useEffect, useRef, useState } from 'react'

type TimerStatus = {
  currentTime: number
  isRunning: boolean
}

export function useTimer() {
  const [startTime,setStartTime] = useState<Date | null>(null)
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
    setStartTime(new Date())
    await window.electronAPI?.startTimer()
    await syncWithMain()
  }

  const stop = async () => {
    const finalTime = await window.electronAPI?.stopTimer()
    setStatus({ currentTime: finalTime || 0, isRunning: false })
    setStartTime(null)
    await syncWithMain
    return finalTime || 0
  }

  useEffect(() => {
    // 首次同步
    syncWithMain()

    // 持续同步（每 100ms）
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
    startTime
  }
}
