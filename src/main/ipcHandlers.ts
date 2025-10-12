import { ipcMain } from "electron"
import { getElapsedTime, startTimer, stopTimer, timerState } from "./timerService"

export const registerTimerHandlers = () => {
    ipcMain.handle('timer-start',(event) => {
        startTimer(event.sender.id)
        return getElapsedTime()
    })

    ipcMain.handle('timer-stop',() => {
        const elapsed = getElapsedTime() 
        stopTimer()
        return elapsed
    })

    ipcMain.handle('timer-get',() => {
        return getElapsedTime()
    })

    ipcMain.handle('timer-isRunning',() => timerState.isRunning)
}