import { RouterProvider } from 'react-router-dom'
import routerConfigure from './router/router'

function App(): React.JSX.Element {

  return (
    <RouterProvider router={routerConfigure} />
  )
}

export default App
