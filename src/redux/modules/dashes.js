import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  DASHES_LIST,
  DASHES_LIST_SUCCESS,
  DASHES_LIST_FAIL,
  DASHES_LIST_ITEM_PARTICIPANTS,
  DASHES_LIST_ITEM_PARTICIPANTS_SUCCESS,
  DASHES_LIST_ITEM_PARTICIPANTS_FAIL,
  DASHES_LIST_ITEM_REWARDS,
  DASHES_LIST_ITEM_REWARDS_SUCCESS,
  DASHES_LIST_ITEM_REWARDS_FAIL,
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
  DASHES_DELETE,
  DASHES_DELETE_SUCCESS,
  DASHES_DELETE_FAIL,
  DASHES_CANCEL,
  DASHES_CANCEL_SUCCESS,
  DASHES_CANCEL_FAIL,
  DASHES_ACTIVATE,
  DASHES_ACTIVATE_SUCCESS,
  DASHES_ACTIVATE_FAIL,
  DASHES_COMPLETE,
  DASHES_COMPLETE_SUCCESS,
  DASHES_COMPLETE_FAIL,

  DASHES_REWARD_CREATE,
  DASHES_REWARD_CREATE_SUCCESS,
  DASHES_REWARD_CREATE_FAIL,
  DASHES_REWARD_UPDATE,
  DASHES_REWARD_UPDATE_SUCCESS,
  DASHES_REWARD_UPDATE_FAIL,
  DASHES_REWARD_DELETE,
  DASHES_REWARD_DELETE_SUCCESS,
  DASHES_REWARD_DELETE_FAIL,

  DASHES_PARTICIPANT_CREATE,
  DASHES_PARTICIPANT_CREATE_SUCCESS,
  DASHES_PARTICIPANT_CREATE_FAIL,
  DASHES_PARTICIPANT_UPDATE,
  DASHES_PARTICIPANT_UPDATE_SUCCESS,
  DASHES_PARTICIPANT_UPDATE_FAIL,
  DASHES_PARTICIPANT_DELETE,
  DASHES_PARTICIPANT_DELETE_SUCCESS,
  DASHES_PARTICIPANT_DELETE_FAIL,

  DASHES_TODO_CREATE,
  DASHES_TODO_CREATE_SUCCESS,
  DASHES_TODO_CREATE_FAIL,
  DASHES_TODO_REMOVE,
  DASHES_TODO_REMOVE_SUCCESS,
  DASHES_TODO_REMOVE_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  list: {},
  loadedList: false,
  loadingList: false,
  filter: 'Draft',
  currentDash: {},
  loading: false,
  loaded: false,
  loadingParticipants: false,
  loadingRewards: false,
  storeUpdateIndicator: 0,
})

export default function dashes(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case DASHES_LIST:
      return state.set('loadingList', true)
    case DASHES_LIST_SUCCESS:
      return state.withMutations((map) => {
        const dashes = action.result ? action.result : {}
        // console.log('mutate list from DASHES_LIST_SUCCESS: ', dashes);
        dashes.forEach(dash => {
          map.setIn(['list', dash.Id], Immutable.fromJS(dash))
        })
        map.set('filter', 'Draft')
        map.set('loadingList', false)
        map.set('loadedList', true)
      })
    case DASHES_LIST_FAIL:
      return state.withMutations((map) => {
        map.set('loadingList', false)
        map.set('loadedList', false)
      })
    case DASHES_LIST_ITEM_PARTICIPANTS_SUCCESS:
      {
        const dashId = action.data.dashId
        const participants = action.result
        return state.withMutations((map) => {
          map.setIn(['list', dashId, 'Participants', 'items'], Immutable.fromJS(participants))
          map.setIn(['list', dashId, 'Participants', 'loaded'], true)
          map.setIn(['list', dashId, 'ParticipantCount'], participants.length)
          map.set('storeUpdateIndicator', Math.random())
        })
      }
    case DASHES_LIST_ITEM_REWARDS_SUCCESS:
      {
        const dashId = action.data.dashId
        const rewards = action.result
        return state.withMutations((map) => {
          console.log('mutate list from DASHES_LIST_ITEM_REWARDS_SUCCESS');
          map.setIn(['list', dashId, 'Rewards', 'items'], Immutable.fromJS(rewards))
          map.setIn(['list', dashId, 'Rewards', 'loaded'], true)
          map.set('storeUpdateIndicator', Math.random())
        })
      }
    case DASHES_FILTER:
      return state.set('filter', action.filter)
    /* Single dash */
    case DASHES_SINGLE_GET:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS({}))
        map.set('loading', true)
        map.set('loaded', false)
        map.set('loadingParticipants', true)
        map.set('loadingRewards', true)
      })
    case DASHES_SINGLE_GET_SUCCESS:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS(action.result))
        map.set('loading', false)
        map.set('loaded', true)
      })
    case DASHES_SINGLE_GET_FAIL:
      return state.withMutations((map) => {
        map.set('currentDash', Immutable.fromJS({}))
        map.set('loading', false)
        map.set('loaded', false)
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
    case DASHES_CREATE_SUCCESS:
    case DASHES_UPDATE_SUCCESS:
      return state.set('loadedList', false)
    default:
      return state
  }
}

/* Get dashes list */

function _getDashesList(orgId) {
  return {
    types: [DASHES_LIST, DASHES_LIST_SUCCESS, DASHES_LIST_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/dashes`)
  }
}

export function getDashesListRewards(orgId, dashId) {
  return {
    types: [DASHES_LIST_ITEM_REWARDS, DASHES_LIST_ITEM_REWARDS_SUCCESS, DASHES_LIST_ITEM_REWARDS_FAIL],
    promise: (client) => client.get(`v1/${orgId}/dashes/${dashId}/rewards`),
    data: {
      dashId: dashId
    }
  }
}

export function getDashesListParticipants(orgId, dashId) {
  return {
    types: [DASHES_LIST_ITEM_PARTICIPANTS, DASHES_LIST_ITEM_PARTICIPANTS_SUCCESS, DASHES_LIST_ITEM_PARTICIPANTS_FAIL],
    promise: (client) => client.get(`v1/${orgId}/dashes/${dashId}/participants`),
    data: {
      dashId: dashId
    }
  }
}

export function getDashesList(orgId) {
  return dispatch => {
    return dispatch(
      _getDashesList(orgId)
    )
    .then((res) => {
      res.map(dash => {
        //if (dash.Status != 'Draft' && dash.Status != 'Closed') {
          // dispatch(getDashesListRewards(orgId, dash.Id))
          dispatch(getDashesListParticipants(orgId, dash.Id))
        //}
      })
    })
    .catch(res => {
      throw new SubmissionError({ _error: res.error })
    })
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
      .then((res) => {
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

export function deleteReward(orgId, dashId, rewardId) {
  return {
    types: [DASHES_REWARD_DELETE, DASHES_REWARD_DELETE_SUCCESS, DASHES_REWARD_DELETE_FAIL],
    promise: (client) => client.del(`/v1/${orgId}/dashes/${dashId}/rewards/${rewardId}`)
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
    promise: (client) => client.put(`/v1/${orgId}/dashes/${dashId}/participants/${participantId}`, { data: model })
  }
}

export function deleteParticipant(orgId, dashId, participantId) {
  return {
    types: [DASHES_PARTICIPANT_DELETE, DASHES_PARTICIPANT_DELETE_SUCCESS, DASHES_PARTICIPANT_DELETE_FAIL],
    promise: (client) => client.del(`/v1/${orgId}/dashes/${dashId}/participants/${participantId}`)
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
    types: [DASHES_TODO_REMOVE, DASHES_TODO_REMOVE_SUCCESS, DASHES_TODO_REMOVE_FAIL],
    promise: (client) => client.delete(`/v1/${orgId}/dashes/${dashId}/todos/${todoId}`)
  }
}

/* Create/update dash */

function updateRewards(dispatch, orgId, dashId, rewards) {
  rewards.forEach((reward) => {
    const { saveStatus, ...rewardData } = reward
    if (reward.deleted) {
      dispatch(deleteReward(orgId, dashId, reward.Id))
    } else if (reward.saveStatus == 1) {
      dispatch(createReward(orgId, dashId, rewardData))
    } else if (reward.saveStatus == 2) {
      dispatch(updateReward(orgId, dashId, reward.Id, rewardData))
    }
  })
}

function updateParticipants(dispatch, orgId, dashId, participants) {
  participants.forEach((participant) => {
    const { saveStatus, ...participantData } = participant
    if (participant.deleted) {
      dispatch(deleteParticipant(orgId, dashId, participant.Id))
    } else if (participant.saveStatus == 1) {
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
      .then((res) => {
        updateRewards(dispatch, orgId, res.Id, rewards)
        updateParticipants(dispatch, orgId, res.Id, participants)
        updateTodos(dispatch, orgId, res.Id, todos)
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
  return dispatch => {
    updateRewards(dispatch, orgId, dashId, rewards)
    updateParticipants(dispatch, orgId, dashId, participants)
    updateTodos(dispatch, orgId, dashId, todos)
    return dispatch(
      _updateDash(orgId, dashId, modelData)
    )
    .then(() => {
      dispatch(push('/dashes'))
    })
    .catch(res => {
      throw new SubmissionError({ _error: res.error })
    })
  }
}

function _deleteDash(orgId, dashId) {
  return {
    types: [DASHES_DELETE, DASHES_DELETE_SUCCESS, DASHES_DELETE_FAIL],
    promise: (client) => client.del(`/v1/${orgId}/dashes/${dashId}`)
  }
}

export function deleteDash(orgId, dashId) {
  return dispatch => {
    return dispatch(
      _deleteDash(orgId, dashId)
    )
    .then(() => {
      dispatch(getDashesList(orgId))
    })
    .catch(res => {
      throw new SubmissionError({ _error: res.error })
    })
  }
}

function _cancelDash(orgId, dashId) {
  return {
    types: [DASHES_CANCEL, DASHES_CANCEL_SUCCESS, DASHES_CANCEL_FAIL],
    promise: (client) => client.put(`/v1/${orgId}/dashes/${dashId}/cancel`)
  }
}

export function cancelDash(orgId, dashId) {
  return dispatch => {
    return dispatch(
      _cancelDash(orgId, dashId)
    )
    .then(() => {
      dispatch(getDashesList(orgId))
    })
    .catch(res => {
      throw new SubmissionError({ _error: res.error })
    })
  }
}

export function activateDash(orgId, dashId) {
  return {
    types: [DASHES_ACTIVATE, DASHES_ACTIVATE_SUCCESS, DASHES_ACTIVATE_FAIL],
    promise: (client) => client.put(`/v1/${orgId}/dashes/${dashId}/activate`)
  }
}

export function completeDash(orgId, dashId) {
  return {
    types: [DASHES_COMPLETE, DASHES_COMPLETE_SUCCESS, DASHES_COMPLETE_FAIL],
    promise: (client) => client.put(`/v1/${orgId}/dashes/${dashId}/complete`)
  }
}
