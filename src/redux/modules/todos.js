import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  TODOS_GET_LIST,
  TODOS_GET_LIST_SUCCESS,
  TODOS_GET_LIST_FAIL,
  TODOS_UPDATE,
  TODOS_UPDATE_SUCCESS,
  TODOS_UPDATE_FAIL,
  TODOS_SET_STATUS,
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
        map.set('todos', Immutable.fromJS([]))
        map.set('loadingTodos', true)
        map.set('loadedTodos', false)
      })
    case TODOS_GET_LIST_SUCCESS:
      return state.withMutations((map) => {
        const todosMap = Immutable.fromJS(action.result).sort((todo1, todo2) => {
          const todo1Name = todo1.get('Name')
          const todo2Name = todo2.get('Name')
          const todo1Cat = todo1.get('Category')
          const todo2Cat = todo2.get('Category')
          if (todo1Cat > todo2Cat) {
            return 1
          } else if (todo1Cat < todo2Cat) {
            return -1
          }
          if (todo1Name > todo2Name) {
            return 1
          } else if (todo1Name < todo2Name) {
            return -1
          }
          return 0
        })
        map.set('todos', todosMap)
        map.set('loadingTodos', false)
        map.set('loadedTodos', true)
      })
    case TODOS_GET_LIST_FAIL:
      return state.withMutations((map) => {
        map.set('todos', Immutable.fromJS([]))
        map.set('loadingTodos', false)
        map.set('loadedTodos', false)
      })
    /* Update todo */
    case TODOS_UPDATE_SUCCESS:
      {
        const index = action.data.index
        const todo = action.data.model
        return state.setIn(['todos', index], todo)
      }
    case TODOS_SET_STATUS:
      {
        const { index, status } = action.data
        const orgStatus = state.getIn(['todos', index, 'Status'])
        return state.withMutations((map) => {
          map.setIn(['todos', index, 'Status'], status)
          map.setIn(['todos', index, 'OrgStatus'], orgStatus)
        })
      }
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

export function updateTodo(orgId, todoId, model, index) {
  return {
    types: [TODOS_UPDATE, TODOS_UPDATE_SUCCESS, TODOS_UPDATE_FAIL],
    promise: (client) => client.put(`/v1/${orgId}/todos/${todoId}`, { data: model }),
    data: {
      model,
      index,
    }
  }
}

export function setTodoStatus(index, status) {
  return {
    type: TODOS_SET_STATUS,
    data: {
      index,
      status
    }
  }
}
