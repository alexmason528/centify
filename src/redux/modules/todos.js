import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  TODOS_GET_LIST,
  TODOS_GET_LIST_SUCCESS,
  TODOS_GET_LIST_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  todos: [],
  loadingTodos: false,
  loadedTodos: false,
})

export default function dashes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    /* Todos - get list */
    case TODOS_GET_LIST:
      return state.withMutations((map) => {
        map.set('todos', Immutable.fromJS({}))
        map.set('loadingTodos', true)
        map.set('loadedTodos', false)
      })
    case TODOS_GET_LIST_SUCCESS:
      return state.withMutations((map) => {
        map.set('todos', Immutable.fromJS(action.result))
        map.set('loadingTodos', false)
        map.set('loadedTodos', true)
      })
    case TODOS_GET_LIST_FAIL:
      return state.withMutations((map) => {
        map.set('todos', Immutable.fromJS({}))
        map.set('loadingTodos', false)
        map.set('loadedTodos', false)
      })
    default:
      return state
  }
}

/* Get dashes list */

export function getTodos(orgId) {
  return {
    types: [TODOS_GET_LIST, TODOS_GET_LIST_SUCCESS, TODOS_GET_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/todos`)
  }
}
