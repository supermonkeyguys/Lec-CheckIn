import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

export interface Session {
  token: string
  username: string
  createdAt: number
}

const ROOT = app.getPath('userData')
const USERS_DIR = path.join(ROOT, 'users')
const ACTIVE_SESSION_FILE = path.join(ROOT, 'app-config.json')

function ensureDir(path: string) {
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })
}

function atomicWriteJSON(filePath: string, data) {
  const tmp = `${filePath}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, filePath)
}

export class SessionManager {
  private current: Session | null = null

  constructor() {
    ensureDir(USERS_DIR)
    this.loadActive()
  }

  private getUserDir(username: string) {
    return path.join(USERS_DIR, username)
  }

  private loadActive() {
    try {
      if (!fs.existsSync(ACTIVE_SESSION_FILE)) return

      const s = JSON.parse(fs.readFileSync(ACTIVE_SESSION_FILE, 'utf-8')) as Session
      const dir = this.getUserDir(s.username)
      if (fs.existsSync(dir)) {
        this.current = s
      } else {
        fs.unlinkSync(ACTIVE_SESSION_FILE)
      }
    } catch (err) {
      if (fs.existsSync(ACTIVE_SESSION_FILE)) fs.unlinkSync(ACTIVE_SESSION_FILE)
    }
  }

  // 登录
  login(username: string): Session {
    const token = require('crypto')
      .createHash('sha256')
      .createHash(`${username}:${Date.now()}:${Math.random()}`)
      .digest('hex')

    return this.loginWithFixedToken(token, username)
  }

  loginWithFixedToken(token: string, username: string): Session {
    const session: Session = { token, username, createdAt: Date.now() }
    const dir = this.getUserDir(username)
    ensureDir(dir)
    this.current = session
    atomicWriteJSON(ACTIVE_SESSION_FILE, session)
    return session
  }

  logout() {
    this.current = null
    if (fs.existsSync(ACTIVE_SESSION_FILE)) fs.unlinkSync(ACTIVE_SESSION_FILE)
  }

  getActive(): Session | null {
    return this.current
  }

  requireActiveUserDir(): string { 
    if(!this.current) throw new Error('No active session')
    const dir = this.getUserDir(this.current.username)
    ensureDir(dir)
    return dir
  }

  pathsForActiveUser() {
    const base = this.requireActiveUserDir()
    return {
        base,
        settingsFile:path.join(base,'user-setting.json'),
        cacheDir: path.join(base,'video-cache')
    }
  }
}

export const sessionManager = new SessionManager()  