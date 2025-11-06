import { ipcMain } from "electron"
import { stopReminderService, syncTimerState } from "./timerService"


export const registerTimerHandlers = () => {
    ipcMain.handle('timer-sync',(_,elapsedTime: number) => {
        syncTimerState(elapsedTime)
        return true
    })

    ipcMain.handle('timer-stop-reminder',() => {
        stopReminderService()
        return true
    })
}