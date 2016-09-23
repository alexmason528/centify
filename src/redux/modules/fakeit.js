import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  FAKE_IT_SUCCESS,
  FAKE_IT_FAIL
} from '../constants'

export default function fakeIt(state = {}, action) {
  switch (action.type) {
    case INIT:
    case FAKE_IT_SUCCESS:
      return state
    default:
      return state
  }
}

/* send event */

export function sendFakeEvent(orgId, body) {
  return {
    types: [FAKE_IT_SUCCESS, FAKE_IT_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/events`, { data: body })
  }
}
