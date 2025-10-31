import { exec } from 'child_process'
import { ipcMain } from 'electron'
import { platform } from 'os'

export const registerVerifyIPHandler = () => {
  ipcMain.handle('check-target-network', async () => {
    const targetGateway = '192.168.124.1'

    const pingCmd =
    platform() === 'win32'
      ? `ping -n 1 -w 2000 ${targetGateway}`
      : `ping -c 1 -W 2 ${targetGateway}`; 

    return new Promise<boolean>((resolve) => {
        exec(pingCmd,(error) => {
            if(error) {
                console.log("failed:",error.message)
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
  })
}
