import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import LayoutContainer from './LayoutContainer/LayoutContainer'
import Home from './Home/Home'
import Login from './Login/Login'
import Dashes from './Dashes/Dashes'
import DashCreate from './DashCreate/DashCreate'
import DashEdit from './DashEdit/DashEdit'
import Todos from './Todos/Todos'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, __AUTH0_REDIRECT__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/home" />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={Login} /> //to prevent router errors

      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="home" component={Home} />
        <Route path="dashes" component={Dashes} />
        <Route path="dashes/new" component={DashCreate} />
        <Route path="dashes/:dashId" component={DashEdit} />
        <Route path="todos" component={Todos} />
      </Route>

    </Route>
  )
}

export default makeMainRoutes
