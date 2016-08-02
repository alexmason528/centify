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

  DASHES_REWARD_CREATE,
  DASHES_REWARD_CREATE_SUCCESS,
  DASHES_REWARD_CREATE_FAIL,
  DASHES_REWARD_UPDATE,
  DASHES_REWARD_UPDATE_SUCCESS,
  DASHES_REWARD_UPDATE_FAIL,

  DASHES_PARTICIPANT_CREATE,
  DASHES_PARTICIPANT_CREATE_SUCCESS,
  DASHES_PARTICIPANT_CREATE_FAIL,
  DASHES_PARTICIPANT_UPDATE,
  DASHES_PARTICIPANT_UPDATE_SUCCESS,
  DASHES_PARTICIPANT_UPDATE_FAIL,

  DASHES_TODO_CREATE,
  DASHES_TODO_CREATE_SUCCESS,
  DASHES_TODO_CREATE_FAIL,
  DASHES_TODO_UPDATE,
  DASHES_TODO_UPDATE_SUCCESS,
  DASHES_TODO_UPDATE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  list: [],
  filter: '',
  currentDash: {},
  loading: false,
  loadingParticipants: false,
  loadingRewards: false,
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

/* Get dashes list */

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

/* Get single dash */

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

/* Create/update rewards, participants, and todos of a dash */

export function createReward(orgId, dashId, model) {
  return {
    types: [DASHES_REWARD_CREATE, DASHES_REWARD_CREATE_SUCCESS, DASHES_REWARD_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes/${dashId}/rewards`, { data: model })
  }
}

export function updateReward(orgId, dashId, rewardId, model) {
  return {
    types: [DASHES_REWARD_CREATE, DASHES_REWARD_CREATE_SUCCESS, DASHES_REWARD_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes/${dashId}/rewards/${rewardId}`, { data: model })
  }
}

export function createParticipant(orgId, dashId, model) {
  return {
    types: [DASHES_PARTICIPANT_CREATE, DASHES_PARTICIPANT_CREATE_SUCCESS, DASHES_PARTICIPANT_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes/${dashId}/participants`, { data: model })
  }
}

export function updateParticipant(orgId, dashId, participantId, model) {
  return {
    types: [DASHES_PARTICIPANT_CREATE, DASHES_PARTICIPANT_CREATE_SUCCESS, DASHES_PARTICIPANT_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes/${dashId}/participants/${participantId}`, { data: model })
  }
}

export function createTodo(orgId, dashId, model) {
  return {
    types: [DASHES_TODO_CREATE, DASHES_TODO_CREATE_SUCCESS, DASHES_TODO_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes/${dashId}/todos`, { data: model })
  }
}

export function deleteTodo(orgId, dashId, todoId) {
  return {
    types: [DASHES_TODO_CREATE, DASHES_TODO_CREATE_SUCCESS, DASHES_TODO_CREATE_FAIL],
    promise: (client) => client.delete(`/v1/${orgId}/dashes/${dashId}/todos/${todoId}`)
  }
}

/* Create/update dash */

function updateRewards(dispatch, orgId, dashId, rewards) {
  rewards.forEach((reward) => {
    const { saveStatus, ...rewardData } = reward
    if (reward.saveStatus == 1) {
      dispatch(createReward(orgId, dashId, rewardData))
    } else if (reward.saveStatus == 2) {
      dispatch(updateReward(orgId, dashId, reward.Id, rewardData))
    }
  })
}

function updateParticipants(dispatch, orgId, dashId, participants) {
  participants.forEach((participant) => {
    const { saveStatus, ...participantData } = participant
    if (participant.saveStatus == 1) {
      dispatch(createParticipant(orgId, dashId, participantData))
    } else if (participant.saveStatus == 2) {
      dispatch(updateParticipant(orgId, dashId, participant.Id, participantData))
    }
  })
}

function updateTodos(dispatch, orgId, dashId, todos) {
  todos.forEach((todo) => {
    const { selected, existed, ...todoData } = todo
    if (selected && !existed) {
      dispatch(createTodo(orgId, dashId, todoData))
    } else if (!selected && existed) {
      dispatch(deleteTodo(orgId, dashId, todo.Id))
    }
  })
}

function _createDash(orgId, model) {
  return {
    types: [DASHES_CREATE, DASHES_CREATE_SUCCESS, DASHES_CREATE_FAIL],
    promise: (client) => client.post(`/v1/${orgId}/dashes`, { data: model })
  }
}

export function createDash(orgId, model) {
  const { rewards, participants, todos, ...modelData } = model
  return dispatch => {
    return dispatch(
        _createDash(orgId, modelData)
      )
      .then((res)=> {
        // updateRewards(dispatch, orgId, res.Id, rewards)
        // updateParticipants(dispatch, orgId, res.Id, participants)
        // updateTodos(dispatch, orgId, res.Id, todos)
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
  const { rewards, participants, todos, ...modelData } = model
  console.log('update dash')
  console.log(model)
  return dispatch => {
    updateRewards(dispatch, orgId, dashId, rewards)
    updateParticipants(dispatch, orgId, dashId, participants)
    updateTodos(dispatch, orgId, dashId, todos)
    return dispatch(
        _updateDash(orgId, dashId, modelData)
      )
      .then((res)=> {
        dispatch(push('/dashes'))
      })
      .catch(res => {
        throw new SubmissionError({ _error: res.error })
      })
  }
}
