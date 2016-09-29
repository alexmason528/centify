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
import FakeIt from './FakeIt/FakeIt'
import Todos from './Todos/Todos'
import TodosEdit from './TodosEdit/TodosEdit'
import Budget from './Budget/Budget'
import Payouts from './Payouts/Payouts'
import AppleTVActivation from './AppleTVActivation/AppleTVActivation'
import Signup from './Signup/Signup'
import Thankyou from './ThankYou/ThankYou'


const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, __DOMAIN__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    localStorage.setItem('returnUrl', nextState.location.pathname)
    replace({ pathname: '/login' })
  } else if (localStorage.getItem('returnUrl')) {
    replace({ pathname: localStorage.getItem('returnUrl') })
    localStorage.removeItem('returnUrl')
  }
}

const captureReturnUrl = (nextState, replace) => {
  var returnUrl = nextState.location.query.returnUrl
  if (returnUrl) {
    localStorage.setItem('returnUrl', returnUrl)
  }
}

export const makeMainRoutes = () => {
  return (
    <Route path="/" component={Container} auth={auth}>
      <IndexRedirect to="/home" />
      <Route path="login" component={Login} onEnter={captureReturnUrl}/>
      <Route path="access_token=:token" component={LoggingIn} />
      <Route path="signup/:token" component={Signup} />

      <Route component={LayoutContainer} onEnter={requireAuth}>
        <Route path="account-not-linked" component={AccountNotLinked} />
        <Route path="home" component={Home} />
        <Route path="thankyou" component={Thankyou} />
        <Route path="spiffs" component={Dashes} />
        <Route path="spiffs/new" component={DashCreate} />
        <Route path="spiffs/:dashId" component={DashEdit} />
        <Route path="spiffs/:dashId/report" component={DashReport} />
        <Route path="spiffs/:dashId/fakeit" component={FakeIt} />
        <Route path="todos" component={Todos} />
        <Route path="todos/edit" component={TodosEdit} />
        <Route path="budget" component={Budget} />
        <Route path="payouts" component={Payouts} />
        <Route path="appletv" component={AppleTVActivation} />
      </Route>

    </Route>
  )
}

export default makeMainRoutes
