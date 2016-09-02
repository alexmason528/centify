import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  BASIC_FILTERS_GET,
  BASIC_FILTERS_GET_SUCCESS,
  BASIC_FILTERS_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  BasicFilters: {},
  loadingBasicFilters: false,
  loadedBasicFilters: false,
})

export default function filters(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case BASIC_FILTERS_GET:
      return state.withMutations((map) => {
        map.set('loadingBasicFilters', true)
        map.set('loadedBasicFilters', false)
      })
    case BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        const filters = action.result
        filters.forEach((filter, index) => {
          map.setIn(['basicFilters', index], Immutable.fromJS(filter))
        })
        map.set('loadingBasicFilters', false)
        map.set('loadedBasicFilters', false)
      })
    case BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loadingBasicFilters', false)
        map.set('loadedBasicFilters', false)
      })
    default:
      return state
  }
}

/* Get Centify-wide basic filters */

export function getBasicFilters() {
  return {
    types: [BASIC_FILTERS_GET, BASIC_FILTERS_GET_SUCCESS, BASIC_FILTERS_GET_FAIL],
    promise: (client) => client.get('/json/basic-filters.json')
  }
}
