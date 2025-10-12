import { RouterProvider } from 'react-router-dom'
import routerConfigure from './router/router'
import GlobalBg from './components/GlobalBg/GlobalBg'
import { useEffect } from 'react'
import { useSetting } from './hooks/useSetting'

function App(): React.JSX.Element {
  const { backgroundType } = useSetting()

  useEffect(() => {
    const hasMedia = backgroundType === 'image' || backgroundType === 'video'

    if (hasMedia) {
      document.body.classList.add('has-background-media')
    } else {
      document.body.classList.remove('has-background-media')
    }

    return () => {
      document.body.classList.remove('has-background-media')
    }
  }, [backgroundType])

  return (
    <>
      <GlobalBg />
      <RouterProvider router={routerConfigure} />
    </>
  )
}

export default App
