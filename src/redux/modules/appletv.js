import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  APPLE_TV_ACTIVATION,
  APPLE_TV_ACTIVATION_SUCCESS,
  APPLE_TV_ACTIVATION_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  budgetAmount: 0,
})

export default function appletv(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    default:
      return state
  }
}

/* Get budget */

export function activateAppleTV(orgId, tvCode) {
  const model = {
    ActivationCode: tvCode
  }
  return {
    types: [APPLE_TV_ACTIVATION, APPLE_TV_ACTIVATION_SUCCESS, APPLE_TV_ACTIVATION_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/devices/adopt`, { data: model })
  }
}
