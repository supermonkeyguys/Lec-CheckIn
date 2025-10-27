import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'
import { sessionManager } from '../session/sessionManager'
import { UserStore } from '../user/userContext'

if (!ffmpegPath) throw new Error('ffmpeg 未找到，请检查 ffmpeg-static 安装')
ffmpeg.setFfmpegPath(ffmpegPath as string)

const unlink = promisify(fs.unlink)
const copyFile = promisify(fs.copyFile)

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function toFileUrl(p: string) {
  return 'file://' + p.replace(/\\/g, '/')
}

export class BackgroundManager {
  private currentBackground: string | null = null

  private getCacheDir(): string {
    const { cacheDir } = sessionManager.pathsForActiveUser()
    ensureDir(cacheDir)
    return cacheDir
  }

  resetForNewSession() {
    this.currentBackground = null
  }

  private async convertVideo(inputPath: string, outputPath: string) {
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .audioBitrate('128k')
        .videoBitrate('3000k')
        .size('?x1080')
        .format('mp4')
        .outputOptions(['-crf 23', '-preset fast', '-movflags +faststart'])
        .on('end', () => resolve())
        .on('error', (e) => reject(e))
        .run()
    })
  }

  async setBackgroundVideo(sourcePath: string): Promise<string | null> {
    const cacheDir = this.getCacheDir()
    const filename = `bg_${Date.now()}.mp4`
    const dest = path.join(cacheDir, filename)

    try {
      await this.convertVideo(sourcePath, dest)
    } catch (err: any) {
      console.warn('转码失败，回退原文件:', err?.message ?? err)
      await copyFile(sourcePath, dest)
    }

    if (this.currentBackground) {
      const old = path.join(cacheDir, this.currentBackground)
      if (fs.existsSync(old)) await unlink(old)
    }

    this.currentBackground = filename
    const fileUrl = toFileUrl(dest)

    UserStore.save({
      backgroundType: 'video',
      backgroundVideoSrc: fileUrl,
      backgroundImageSrc: undefined
    })

    return fileUrl
  }

  async setBackgroundImage(sourcePath: string): Promise<string | null> {
    const cacheDir = this.getCacheDir()
    const ext = path.extname(sourcePath) || '.png'
    const filename = `bg_${Date.now()}${ext}`
    const dest = path.join(cacheDir, filename)

    await copyFile(sourcePath, dest)

    if (this.currentBackground) {
      const old = path.join(cacheDir, this.currentBackground)
      if (fs.existsSync(old)) await unlink(old)
    }

    this.currentBackground = filename
    const fileUrl = toFileUrl(dest)

    UserStore.save({
      backgroundType: 'image',
      backgroundImageSrc: fileUrl,
      backgroundVideoSrc: undefined
    })

    return fileUrl
  }

  // 仅返回 file:// URL，不创建 blob:
  getBackgroundFileUrl(): string | null {
    if (this.currentBackground) {
      const cacheDir = this.getCacheDir()
      const p = path.join(cacheDir, this.currentBackground)
      return fs.existsSync(p) ? toFileUrl(p) : null
    }

    try {
      const s = UserStore.load()
      const url =
        s.backgroundType === 'video'
          ? s.backgroundVideoSrc
          : s.backgroundType === 'image'
          ? s.backgroundImageSrc
          : null

      if (url && url.startsWith('file://')) {
        const filePath = url.replace('file://', '')
        const fname = path.basename(filePath)
        this.currentBackground = fname
        return fs.existsSync(filePath) ? url : null
      }
    } catch (err) {
      console.log(err)
    }
    return null
  }

  async getBackgroundVideoBuffer(): Promise<Buffer | null> {
    const url = this.getBackgroundFileUrl()
    if (!url || !url.startsWith('file://')) return null // 避免 blob:
    const filePath = url.replace(/^file:\/\//, '').replace(/\//g, path.sep)
    if (!fs.existsSync(filePath)) return null
    try {
      return await fs.promises.readFile(filePath)
    } catch (err) {
      console.error('读取视频失败:', err)
      return null
    }
  }

  async getBackgroundImageBuffer(): Promise<Buffer | null> {
    const url = this.getBackgroundFileUrl()
    if (!url || !url.startsWith('file://')) return null // 避免 blob:
    const filePath = url.replace(/^file:\/\//, '').replace(/\//g, path.sep)
    if (!fs.existsSync(filePath)) return null
    try {
      return await fs.promises.readFile(filePath)
    } catch (err) {
      console.error('读取图片失败:', err)
      return null
    }
  }

  async clearAllForActiveUser() {
    const cacheDir = this.getCacheDir()
    if (!fs.existsSync(cacheDir)) return
    for (const name of fs.readdirSync(cacheDir)) {
      const full = path.join(cacheDir, name)
      if (fs.statSync(full).isFile()) await unlink(full)
    }
  }

  restoreFromSettings(): void {
    this.currentBackground = null
    void this.getBackgroundFileUrl()
  }
}

export const backgroundManager = new BackgroundManager()
