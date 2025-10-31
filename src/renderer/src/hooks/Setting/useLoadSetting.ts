// hooks/useSettingSync.ts
import { StateType } from '@renderer/store'
import { updateSetting } from '@renderer/store/settingReducer'
import { message } from 'antd'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Options = {
  autoLoad?: boolean
  autoPersist?: boolean
  debounceMs?: number
}

export default function useSettingSync(options: Options = {}) {
  const { autoLoad = true } = options
  const dispatch = useDispatch()
  const setting = useSelector((s: StateType) => s.setting)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!autoLoad) return
    ;(async () => {
      try {
        const cached = (await window.electronAPI?.getUserSetting()) ?? {}
        console.log(cached)
        let backgroundImageSrc = ''
        let backgroundVideoSrc = ''
        if(cached.backgroundType === 'image') {
          const raw = await window.electronAPI?.getBgImageBuffer()
          if(!raw) {
            message.error('图片加载失败')
            return 
          }

          const u8 = raw?.data && Array.isArray(raw.data) ? new Uint8Array(raw.data) : new Uint8Array(raw)
          const blob = new Blob([u8], { type: 'image/jpg' })
          backgroundImageSrc = URL.createObjectURL(blob)
        }
        else if(cached.backgroundType === 'video') {
          const raw = await window.electronAPI?.getBgVideoBuffer()
          if(!raw) {
            console.log(raw)
            message.error('视频加载失败')
            return 
          }

          const u8 = raw?.data && Array.isArray(raw.data) ? new Uint8Array(raw.data) : new Uint8Array(raw)
          const blob = new Blob([u8], { type: 'video/mp4' })
          backgroundVideoSrc = URL.createObjectURL(blob)
        }

        // 统一 dispatch，一次性合并
        dispatch(updateSetting({
          ...cached,
          backgroundImageSrc,
          backgroundVideoSrc
        }))
      } finally {
        hydratedRef.current = true
      }
    })()
  }, [autoLoad, dispatch])

  return {
    setting,
    hydrated: hydratedRef.current,
  }
}
