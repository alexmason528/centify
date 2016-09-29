import React from 'react'
import {browserHistory, Router, Route, Redirect} from 'react-router'

import makeMainRoutes from './views/Main/routes'

export const makeRoutes = (auth) => {
  const main = makeMainRoutes(auth);

  return (
    <Route path=''>
      {main}
    </Route>
  )
}



export default makeRoutes
