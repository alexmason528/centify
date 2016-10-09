import Immutable from 'immutable'

import {
  INIT,
  REDUX_INIT,
  DASH_TYPES_GET,
  DASH_TYPES_GET_SUCCESS,
  DASH_TYPES_GET_FAIL
} from '../constants'

const initialState = Immutable.fromJS({
  dashtypes: {},
  loading: false,
  loaded: false
})

export default function dashtypes (state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DASH_TYPES_GET:
      return state.set('loading', true)
    case DASH_TYPES_GET_SUCCESS:
      return state.withMutations((map) => {
        const types = action.result ? action.result : {}
        types.map((type) => {
          map.setIn(['dashtypes', type.Id], Immutable.fromJS(type))
        })
        map.set('loading', false)
        map.set('loaded', true)
      })
    case DASH_TYPES_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loading', false)
        map.set('loaded', false)
      })
    default:
      return state
  }
}

/* Get budget */

export function getDashTypes (orgId) {
  return {
    types: [DASH_TYPES_GET, DASH_TYPES_GET_SUCCESS, DASH_TYPES_GET_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/dash-types`)
  }
}
