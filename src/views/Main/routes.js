import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import LayoutContainer from './LayoutContainer/LayoutContainer'
import Home from './Home/Home'
import Login from './Login/Login'
import Dashes from './Dashes/Dashes'
import DashEdit from './DashEdit/DashEdit'

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
      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="home" component={Home} />
        <Route path="dashes" component={Dashes} />
        <Route path="dashes/new" component={DashEdit} />
        <Route path="dashes/:dashId" component={DashEdit} />

        <Route path="access_token=:token" component={Login} /> //to prevent router errors
      </Route>
    </Route>
  )
}

export default makeMainRoutes
