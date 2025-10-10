import { RouterProvider } from 'react-router-dom'
import routerConfigure from './router/router'
import TitleBar from './components/TitleBar/TitleBar'

function App(): React.JSX.Element {

  return (
    <div>
      <TitleBar />
      <RouterProvider router={routerConfigure} />
    </div>
  )
}

export default App
