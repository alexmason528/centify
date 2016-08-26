import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  DASH_BANNERS_GET,
  DASH_BANNERS_GET_SUCCESS,
  DASH_BANNERS_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  dashbanners: {},
  loading: false,
  loaded: false,
})

export default function dashbanners(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DASH_BANNERS_GET:
      return state.set('loading', true)
    case DASH_BANNERS_GET_SUCCESS:
      return state.withMutations((map) => {
        const banners = action.result ? action.result : {}
        banners.map(banner => {
          map.setIn(['dashbanners', banner.Id], Immutable.fromJS(banner))
        })
        map.set('loading', false)
        map.set('loaded', true)
      })
    case DASH_BANNERS_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loading', false)
        map.set('loaded', false)
      })
    default:
      return state
  }
}

/* Get budget */

export function getDashBanners() {
  return {
    types: [DASH_BANNERS_GET, DASH_BANNERS_GET_SUCCESS, DASH_BANNERS_GET_FAIL],
    promise: (client) => client.get('/v1/dashes/banners')
  }
}
