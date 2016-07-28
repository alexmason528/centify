import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import LayoutContainer from './LayoutContainer/LayoutContainer'
import Home from './Home/Home'
import Dashes from './Dashes/Dashes'
import Login from './Login/Login'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);

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
      <Route path="auth0-callback" />
      <Route component={LayoutContainer}>
        <Route path="home" component={Home} onEnter={requireAuth} />
        <Route path="dashes" component={Dashes} onEnter={requireAuth} />
        <Route path="access_token=:token" component={Login} /> //to prevent router errors
      </Route>
    </Route>
  )
}

export default makeMainRoutes
