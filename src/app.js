import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from 'redux/create';
import AuthService from 'utils/AuthService'
import ApiClient from 'utils/ApiClient';

import 'font-awesome/css/font-awesome.css'
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css'
import './app.css'

import makeRoutes from './routes'

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, __DOMAIN__);
const client = new ApiClient(auth);
const store = createStore(hashHistory, client);
const history = syncHistoryWithStore(hashHistory, store);
const routes = makeRoutes(auth);

const mountNode = document.querySelector('#root');

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
mountNode);
