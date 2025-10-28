// hooks/useSettingSync.ts
import { StateType } from '@renderer/store'
import { updateSetting } from '@renderer/store/settingReducer'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Options = {
  autoLoad?: boolean
  autoPersist?: boolean
  debounceMs?: number
}

export default function useSettingSync(options: Options = {}) {
  const { autoLoad = true, autoPersist = true, debounceMs = 500 } = options
  const dispatch = useDispatch()
  const setting = useSelector((s: StateType) => s.setting)
  const hydratedRef = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!autoLoad) return
    ;(async () => {
      try {
        const cached = (await window.electronAPI?.getUserSetting()) ?? {}
        console.log(cached)

        // 统一 dispatch，一次性合并
        dispatch(updateSetting({
          ...cached,
        }))
      } finally {
        hydratedRef.current = true
      }
    })()
  }, [autoLoad, dispatch])

  // 变更自动持久化（防抖 & 等待 hydrated）
  useEffect(() => {
    if (!autoPersist) return
    if (!hydratedRef.current) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      window.electronAPI?.updateUserSetting(setting)
    }, debounceMs)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [setting, autoPersist, debounceMs])

  return {
    setting,
    hydrated: hydratedRef.current,
  }
}
