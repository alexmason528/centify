import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,

  SCHEMAS_GET,
  SCHEMAS_GET_SUCCESS,
  SCHEMAS_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  schemas: {},
  loading: false,
  loaded: false,
})

export default function schemas(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case SCHEMAS_GET:
      return state.withMutations((map) => {
        map.set('loading', true)
        map.set('loaded', false)
      })
    case SCHEMAS_GET_SUCCESS:
      return state.withMutations((map) => {
        const schemas = action.result
        schemas.forEach(schema => {
          const fields = {}
          schema.Fields.forEach(field => {
            fields[field.Id] = field
          })
          schema.Fields = fields
          map.setIn(['schemas', schema.Type], Immutable.fromJS(schema))
        })
        map.set('loading', false)
        map.set('loaded', true)
      })
    case SCHEMAS_GET_FAIL:
      return state.withMutations((map) => {
        map.set('loading', false)
        map.set('loaded', false)
      })
    default:
      return state
  }
}

/* Get organization-wide schemas */

export function getSchemas(orgId) {
  return {
    types: [SCHEMAS_GET, SCHEMAS_GET_SUCCESS, SCHEMAS_GET_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/schemas`)
  }
}
