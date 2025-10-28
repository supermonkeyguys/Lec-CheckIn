import * as fs from 'fs'
import { sessionManager } from '../session/sessionManager'

export interface UserSetting {
  reminderTime?: number
  reminderInterval?: number
  backgroundType?: 'none' | 'image' | 'video'
  backgroundImageSrc?: string
  backgroundVideoSrc?: string
  updateAt?: number
}

function atomicWriteJSON(filepath: string, data: unknown) {
  const tmp = `${filepath}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, filepath)
}

export const UserStore = {
  load(): UserSetting {
    if (!sessionManager.getActive()) return {}

    const { settingsFile } = sessionManager.pathsForActiveUser()
    try {
      if (fs.existsSync(settingsFile)) {
        const settings = fs.readFileSync(settingsFile, 'utf-8')
        return JSON.parse(settings)
      }
    } catch (e) {
      console.warn('读取设置失败:', e)
    }
    return {}
  },

  save(patch: Partial<UserSetting>): UserSetting {
    const { settingsFile } = sessionManager.pathsForActiveUser()
    const old = this.load()
    console.log('patch: ', patch)
    const merged: UserSetting = { ...old, ...patch, updateAt: Date.now() }
    atomicWriteJSON(settingsFile, merged)
    return merged
  },

  clear() {
    const { settingsFile } = sessionManager.pathsForActiveUser()
    if (fs.existsSync(settingsFile)) fs.unlinkSync(settingsFile)
  }
}
