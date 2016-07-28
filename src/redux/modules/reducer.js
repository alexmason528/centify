import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import { reducer as reduxAsyncConnect } from 'redux-connect';
// import { reducer as formReducer } from 'redux-form';
import dashes from './dashes'

export default combineReducers({
  routing: routerReducer,
  // form: formReducer,
  dashes,
});
