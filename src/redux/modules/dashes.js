import { push } from 'react-router-redux';
import Immutable from 'immutable';

import {
  INIT,
  REDUX_INIT,
  DASHES_LIST,
  DASHES_LIST_SUCCESS,
  DASHES_LIST_FAIL,
  DASHES_FILTER,
} from '../constants'

const initialState = Immutable.fromJS({
  list: [],
  filter: '',
})

export default function dashes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DASHES_LIST_SUCCESS:
      return state.withMutations((map)=> {
        const dashes = action.result ? action.result : []
        map.set('list', Immutable.fromJS(dashes))
        map.set('filter', '')
      })
    case DASHES_FILTER:
      return state.set('filter', action.filter)
    default:
      return state
  }
}

export function getDashesList(orgId, status, owner_id) {
  return {
    types: [DASHES_LIST, DASHES_LIST_SUCCESS, DASHES_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/dashes`, { status, owner_id })
  };
}

export function filterDashes(status) {
  return {
    type: DASHES_FILTER,
    filter: status,
  }
}

/*
export function postDispatchSample(params) {
  return dispatch => {
    return dispatch(
        action(params)
      )
      .then((res)=> {
        // when succeeded
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error });
      });
  };
}
*/
