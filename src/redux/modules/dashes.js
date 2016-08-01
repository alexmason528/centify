import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

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
  DASHES_UPDATE,
  DASHES_UPDATE_SUCCESS,
  DASHES_UPDATE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  list: [],
  filter: '',
  currentDash: {},
  loading: false,
  loadingParticipants: false,
  loadingRewards: false,
  loadingTodos: false,
})

export default function dashes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DASHES_LIST_SUCCESS:
      return state.withMutations((map) => {
        const dashes = action.result ? action.result : []
        map.set('list', Immutable.fromJS(dashes))
        map.set('filter', '')
      })
    case DASHES_FILTER:
      return state.set('filter', action.filter)
    /* Single dash */
    case DASHES_SINGLE_GET:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS({}))
        map.set('loading', true)
        map.set('loadingParticipants', true)
        map.set('loadingRewards', true)
        map.set('loadingTodos', true)
      })
    case DASHES_SINGLE_GET_SUCCESS:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS(action.result))
        map.set('loading', false)
      })
    case DASHES_SINGLE_GET_FAIL:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS({}))
        map.set('loading', false)
      })
    /* Single dash - participants */
    case DASHES_SINGLE_GET_PARTICIPANTS:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Participants'], Immutable.fromJS({}))
        map.set('loadingParticipants', true)
      })
    case DASHES_SINGLE_GET_PARTICIPANTS_SUCCESS:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Participants'], Immutable.fromJS(action.result))
        map.set('loadingParticipants', false)
      })
    case DASHES_SINGLE_GET_PARTICIPANTS_FAIL:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Participants'], Immutable.fromJS({}))
        map.set('loadingParticipants', false)
      })
    /* Single dash - rewards */
    case DASHES_SINGLE_GET_REWARDS:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Rewards'], Immutable.fromJS({}))
        map.set('loadingRewards', true)
      })
    case DASHES_SINGLE_GET_REWARDS_SUCCESS:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Rewards'], Immutable.fromJS(action.result))
        map.set('loadingRewards', false)
      })
    case DASHES_SINGLE_GET_REWARDS_FAIL:
      return state.withMutations((map) => {
        map.setIn(['currentDash', 'Rewards'], Immutable.fromJS({}))
        map.set('loadingRewards', false)
      })
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
        dispatch(getDashParticipants(res.Participants.href))
        dispatch(getDashRewards(res.Rewards.href))
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error })
      })
  }
}

function _createDash(orgId, model) {
  return {
    types: [DASHES_CREATE, DASHES_CREATE_SUCCESS, DASHES_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes`, { data: model })
  }
}

export function createDash(orgId, model) {
  return dispatch => {
    return dispatch(
        _createDash(orgId, model)
      )
      .then((res)=> {
        dispatch(push('/dashes'))
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error })
      })
  }
}

function _updateDash(orgId, dashId, model) {
  return {
    types: [DASHES_UPDATE, DASHES_UPDATE_SUCCESS, DASHES_UPDATE_FAIL],
    promise: (client) => client.put(`/v1/${orgId}/dashes/${dashId}`, { data: model })
  }
}

export function updateDash(orgId, dashId, model) {
  return dispatch => {
    return dispatch(
        _updateDash(orgId, dashId, model)
      )
      .then((res)=> {
        dispatch(push('/dashes'))
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error })
      })
  }
}
