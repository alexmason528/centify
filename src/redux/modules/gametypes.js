import { push } from 'react-router-redux'
import Immutable from 'immutable'
import { SubmissionError } from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  GAME_TYPES_GET,
  GAME_TYPES_GET_SUCCESS,
  GAME_TYPES_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  gametypes: {},
  loading: false,
  loaded: false,
})

export default function gametypes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case GAME_TYPES_GET:
      return state.withMutations((map) => {
        map.set('loading', true)
        map.set('loaded', false)
      })
    case GAME_TYPES_GET_SUCCESS:
      return state.withMutations((map) => {
        const gametypes = action.result
        gametypes.forEach(gametype => {
          map.setIn(['gametypes', gametype.Id], Immutable.fromJS(gametype))
        })
        map.set('loading', false)
        map.set('loaded', true)
      })
    case GAME_TYPES_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loading', false)
        map.set('loaded', false)
      })
    default:
      return state
  }
}

/* Get game types */

export function getGameTypes() {
  return {
    types: [GAME_TYPES_GET, GAME_TYPES_GET_SUCCESS, GAME_TYPES_GET_FAIL],
    promise: (client) => client.get('v1/dashes/game-types')
  }
}
