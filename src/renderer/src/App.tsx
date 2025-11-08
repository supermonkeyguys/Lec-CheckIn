import { RouterProvider } from 'react-router-dom'
import routerConfigure from './router/router'
import { useEffect } from 'react'

function App(): React.JSX.Element {

  useEffect(() => {
    const { electronAPI } = window

    if (!electronAPI) return

    const removeUpdateAvailable = electronAPI.onUpdateAvailable((version) => {
      if (confirm(`发现新版本 v${version}，是否下载？`)) {
        console.log(`发现新版本 v${version}，是否下载？`)
      }
    })

    const removeUpdateDownloaded = electronAPI.onUpdateDownloaded((version) => {
      if (confirm(`v${version} 已下载完成，是否立即重启安装？`)) {
        electronAPI.installUpdate()
      }
    })

    return () => {
      removeUpdateAvailable()
      removeUpdateDownloaded()
    }
  }, [])

  return (
    <>
      <RouterProvider router={routerConfigure} />
    </>
  )
}

export default App
