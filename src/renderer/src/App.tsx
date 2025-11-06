import { RouterProvider } from 'react-router-dom'
import routerConfigure from './router/router'
import { useEffect } from 'react'
import { ipcRenderer } from 'electron'

function App(): React.JSX.Element {

  useEffect(() => {
    const handleUpdateAvailable = (_: any, version: string) => {
      if (confirm(`发现新版本 v${version}，是否下载？`)) { }
    }

    const handleUpdateDownloaded = (_: any, version: string) => {
      if (confirm(`v${version} 已下载完成，是否立即重启安装？`)) {
        ipcRenderer.send('install-update');
      }
    }

    ipcRenderer.on('update-available', handleUpdateAvailable)
    ipcRenderer.on('update-downloaded', handleUpdateDownloaded)

    return () => {
      ipcRenderer.removeAllListeners('update-available')
      ipcRenderer.removeAllListeners('update-downloaded')
    }
  }, [])

  return (
    <>
      <RouterProvider router={routerConfigure} />
    </>
  )
}

export default App
