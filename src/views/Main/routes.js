import React from 'react'
import {Route, IndexRedirect} from 'react-router'
import AuthService from 'utils/AuthService'
import Container from './Container'
import LayoutContainer from './LayoutContainer/LayoutContainer'
import Home from './Home/Home'
import Login from './Login/Login'
import LoggingIn from './LoggingIn/LoggingIn'
import AccountNotLinked from './AccountNotLinked/AccountNotLinked'
import Dashes from './Dashes/Dashes'
import DashCreate from './DashCreate/DashCreate'
import DashEdit from './DashEdit/DashEdit'
import DashReport from './DashReport/DashReport'
import Todos from './Todos/Todos'
import TodosEdit from './TodosEdit/TodosEdit'
import Payouts from './Payouts/Payouts'
import AppleTVActivation from './AppleTVActivation/AppleTVActivation'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, __DOMAIN__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/dashes" />
      <Route path="login" component={Login} />
      <Route path="access_token=:token" component={LoggingIn} />

      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="account-not-linked" component={AccountNotLinked} />
        <Route path="home" component={Home} />
        <Route path="dashes" component={Dashes} />
        <Route path="dashes/new" component={DashCreate} />
        <Route path="dashes/:dashId" component={DashEdit} />
        <Route path="dashes/:dashId/report" component={DashReport} />
        <Route path="todos" component={Todos} />
        <Route path="todos/edit" component={TodosEdit} />
        <Route path="payouts" component={Payouts} />
        <Route path="appletv" component={AppleTVActivation} />
      </Route>

    </Route>
  )
}

export default makeMainRoutes
