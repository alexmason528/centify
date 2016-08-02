import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  USERS_GET_LIST,
  USERS_GET_LIST_SUCCESS,
  USERS_GET_LIST_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  users: [],
  loadedUsers: false,
  loadingUsers: false,
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    /* Get users list */
    case USERS_GET_LIST:
      return state.withMutations((map) => {
        map.set('users', Immutable.fromJS({}))
        map.set('loadedUsers', false)
        map.set('loadingUsers', true)
      })
    case USERS_GET_LIST_SUCCESS:
      return state.withMutations((map) => {
        map.set('users', Immutable.fromJS(action.result))
        map.set('loadedUsers', true)
        map.set('loadingUsers', false)
      })
    case USERS_GET_LIST_FAIL:
      return state.withMutations((map) => {
        map.set('users', Immutable.fromJS({}))
        map.set('loadedUsers', false)
        map.set('loadingUsers', false)
      })
    default:
      return state
  }
}

export function getUsers(orgId) {
  return {
    types: [USERS_GET_LIST, USERS_GET_LIST_SUCCESS, USERS_GET_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/users`)
  }
}
