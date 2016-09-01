import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as formReducer } from 'redux-form';
import dashes from './dashes'
import users from './users'
import todos from './todos'
import budget from './budget'
import dashtypes from './dashtypes'
import dashbanners from './dashbanners'
import appletv from './appletv'
import filters from './filters'

export default combineReducers({
  routing: routerReducer,
  form: formReducer,
  dashes,
  users,
  todos,
  budget,
  dashtypes,
  dashbanners,
  appletv,
  filters,
});
