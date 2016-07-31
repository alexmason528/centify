import { push } from 'react-router-redux';
import Immutable from 'immutable';

import {
  INIT,
  REDUX_INIT,
  DASHES_LIST,
  DASHES_LIST_SUCCESS,
  DASHES_LIST_FAIL,
  DASHES_FILTER,
  DASHES_SINGLE_GET,
  DASHES_SINGLE_GET_SUCCESS,
  DASHES_SINGLE_GET_FAIL,
  DASHES_SINGLE_GET_PARTICIPANTS,
  DASHES_SINGLE_GET_PARTICIPANTS_SUCCESS,
  DASHES_SINGLE_GET_PARTICIPANTS_FAIL,
  DASHES_SINGLE_GET_REWARDS,
  DASHES_SINGLE_GET_REWARDS_SUCCESS,
  DASHES_SINGLE_GET_REWARDS_FAIL,
  DASHES_CREATE,
  DASHES_CREATE_SUCCESS,
  DASHES_CREATE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  list: [],
  filter: '',
  currentDash: {},
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
    case DASHES_SINGLE_GET_SUCCESS:
      return state.set('currentDash', Immutable.fromJS(action.result))
    case DASHES_SINGLE_GET_PARTICIPANTS_SUCCESS:
      return state.setIn(['currentDash', 'Participants'], Immutable.fromJS(action.result))
    case DASHES_SINGLE_GET_REWARDS_SUCCESS:
      return state.setIn(['currentDash', 'Rewards'], Immutable.fromJS(action.result))
    default:
      return state
  }
}

export function getDashesList(orgId, status, owner_id) {
  return {
    types: [DASHES_LIST, DASHES_LIST_SUCCESS, DASHES_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/dashes`, { status, owner_id })
  }
}

export function filterDashes(status) {
  return {
    type: DASHES_FILTER,
    filter: status,
  }
}

function _getDash(orgId, dashId) {
  return {
    types: [DASHES_SINGLE_GET, DASHES_SINGLE_GET_SUCCESS, DASHES_SINGLE_GET_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/dashes/${dashId}`)
  }
}

export function getDashParticipants(href) {
  return {
    types: [DASHES_SINGLE_GET_PARTICIPANTS, DASHES_SINGLE_GET_PARTICIPANTS_SUCCESS, DASHES_SINGLE_GET_PARTICIPANTS_FAIL],
    promise: (client) => client.get(href)
  }
}

export function getDashRewards(href) {
  return {
    types: [DASHES_SINGLE_GET_REWARDS, DASHES_SINGLE_GET_REWARDS_SUCCESS, DASHES_SINGLE_GET_REWARDS_FAIL],
    promise: (client) => client.get(href)
  }
}

export function getDash(orgId, dashId) {
  return dispatch => {
    return dispatch(
        _getDash(orgId, dashId)
      )
      .then((res)=> {
        dispatch(getDashParticipants(res.Participants.href));
        dispatch(getDashRewards(res.Rewards.href));
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error });
      });
  };
}

function _createDash(orgId, data) {
  return {
    types: [DASHES_CREATE, DASHES_CREATE_SUCCESS, DASHES_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes`, data)
  }
}

export function createDash(orgId, data) {
  return dispatch => {
    return dispatch(
        _createDash(orgId, dashId)
      )
      .then((res)=> {
        dispatch(push('/dashes'))
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error });
      });
  };
}
