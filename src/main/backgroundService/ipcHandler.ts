import { dialog, ipcMain } from "electron"
import { backgroundManager } from "./backgroundManager"


export function registerBackgroundHandlers() {
    ipcMain.handle('set-background-video', async (_, sourcePath: string) => {
      return await backgroundManager.setBackgroundVideo(sourcePath)
    })
    ipcMain.handle('set-background-image',async (_,sourcePath:string) => {
      return await backgroundManager.setBackgroundImage(sourcePath)
    })
    ipcMain.handle('get-current-background', () => {
      return backgroundManager.getBackgroundFileUrl()
    })
    
    ipcMain.handle('show-open-dialog', async (_, options) => {
      try {
        const result = await dialog.showOpenDialog(options)
        return result
      } catch (error) {
        console.error('Show open dialog failed', error)
        return { canceled: true, error: error }
      }
    })

    ipcMain.handle('get-background-video-buffer',async () => {
      return await backgroundManager.getBackgroundVideoBuffer()
    })
    ipcMain.handle('get-background-image-buffer',async () => {
      return await backgroundManager.getBackgroundImageBuffer()
    })
} 