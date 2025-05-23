import { BrowserRouter, Route, Routes } from 'react-router';
import { omit } from 'lodash';

import routesConfig, { RouteType } from './config';

export default function RoutesComponent() {
  const renderRoute = (route: RouteType) => {
    if (route.routes)
      return renderLayout(route)

    return <Route {...route} key={route.key} />
  }

  const renderLayout = (route: RouteType) => {
    return (
      // handle error eslint karena route memiliki key yang tidak dibutuhkan oleh Route
      <Route {...omit(route, [])} key={route.key}>
        {route.routes?.map(renderRoute)}
      </Route>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {routesConfig.map(renderRoute)}
      </Routes>
    </BrowserRouter>
  )
}