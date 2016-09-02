import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  GLOBAL_BASIC_FILTERS_GET,
  GLOBAL_BASIC_FILTERS_GET_SUCCESS,
  GLOBAL_BASIC_FILTERS_GET_FAIL,

  ORG_BASIC_FILTERS_GET,
  ORG_BASIC_FILTERS_GET_SUCCESS,
  ORG_BASIC_FILTERS_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  globalBasicFilters: {},
  loadingGlobalBasicFilters: false,
  loadedGlobalBasicFilters: false,
  orgBasicFilters: {},
  loadingOrgBasicFilters: false,
  loadedOrgBasicFilters: false,
})

export default function filters(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case GLOBAL_BASIC_FILTERS_GET:
      return state.withMutations((map) => {
        map.set('loadingGlobalBasicFilters', true)
        map.set('loadedGlobalBasicFilters', false)
      })
    case GLOBAL_BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        const filters = action.result
        filters.forEach((filter, index) => {
          map.setIn(['globalBasicFilters', index], Immutable.fromJS(filter))
        })
        map.set('loadingGlobalBasicFilters', false)
        map.set('loadedGlobalBasicFilters', false)
      })
    case GLOBAL_BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loadingGlobalBasicFilters', false)
        map.set('loadedGlobalBasicFilters', false)
      })
    case ORG_BASIC_FILTERS_GET:
      return state.withMutations((map) => {
        map.set('loadingOrgBasicFilters', true)
        map.set('loadedOrgBasicFilters', false)
      })
    case ORG_BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        const filters = action.result
        filters.forEach((filter, index) => {
          map.setIn(['orgBasicFilters', index], Immutable.fromJS(filter))
        })
        map.set('loadingOrgBasicFilters', false)
        map.set('loadedOrgBasicFilters', false)
      })
    case ORG_BASIC_FILTERS_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loadingOrgBasicFilters', false)
        map.set('loadedOrgBasicFilters', false)
      })
    default:
      return state
  }
}

/* Get Centify-wide basic filters */

export function getGlobalBasicFilters() {
  return {
    types: [GLOBAL_BASIC_FILTERS_GET, GLOBAL_BASIC_FILTERS_GET_SUCCESS, GLOBAL_BASIC_FILTERS_GET_FAIL],
    promise: (client) => client.get('/json/basic-filters.json')
  }
}

/* Get organization-wide basic filters */

export function getOrgBasicFilters(orgId) {
  return {
    types: [ORG_BASIC_FILTERS_GET, ORG_BASIC_FILTERS_GET_SUCCESS, ORG_BASIC_FILTERS_GET_FAIL],
    promise: (client) => client.get(`/v1/schemas/${orgId}`)
  }
}
