import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  USERS_GET_IDENTITY,
  USERS_GET_IDENTITY_SUCCESS,
  USERS_GET_IDENTITY_FAIL,
  USERS_GET_LIST,
  USERS_GET_LIST_SUCCESS,
  USERS_GET_LIST_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  identity: {},
  loadedIdentity: false,
  loadingIdentity: false,
  users: {},
  loadedUsers: false,
  loadingUsers: false,
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    /* Get identity of current logged in user */
    case USERS_GET_IDENTITY:
      return state.withMutations((map) => {
        map.set('identity', Immutable.fromJS({}))
        map.set('loadedIdentity', false)
        map.set('loadingIdentity', true)
      })
    case USERS_GET_IDENTITY_SUCCESS:
      return state.withMutations((map) => {
        map.set('identity', Immutable.fromJS(action.result))
        map.set('loadedIdentity', true)
        map.set('loadingIdentity', false)
      })
    case USERS_GET_IDENTITY_FAIL:
      return state.withMutations((map) => {
        map.set('identity', Immutable.fromJS({}))
        map.set('loadedIdentity', false)
        map.set('loadingIdentity', false)
      })
    /* Get users list */
    case USERS_GET_LIST:
      return state.withMutations((map) => {
        map.set('users', Immutable.fromJS({}))
        map.set('loadedUsers', false)
        map.set('loadingUsers', true)
      })
    case USERS_GET_LIST_SUCCESS:
      return state.withMutations((map) => {
        const users = action.result
        for(let i = 0; i < users.length; i++) {
          map.setIn(['users', users[i].Id], Immutable.fromJS(users[i]))
        }
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

export function getUserIdentity(orgId, userId) {
  return {
    types: [USERS_GET_IDENTITY, USERS_GET_IDENTITY_SUCCESS, USERS_GET_IDENTITY_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/users/${userId}`)
  }
}

export function getUsers(orgId) {
  return {
    types: [USERS_GET_LIST, USERS_GET_LIST_SUCCESS, USERS_GET_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/users`)
  }
}
