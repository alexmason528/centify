import { push } from 'react-router-redux'
import Immutable from 'immutable'
import {SubmissionError} from 'redux-form'

import {
  INIT,
  REDUX_INIT,
  BUDGET_GET,
  BUDGET_GET_SUCCESS,
  BUDGET_GET_FAIL,
} from '../constants'

const initialState = Immutable.fromJS({
  budgetAmount: 0,
})

export default function budget(state = initialState, action) {
  switch (action.type) {
    case INIT:
    case REDUX_INIT:
      return state
    case BUDGET_GET_SUCCESS:
      return state.set('budgetAmount', action.result.BudgetAmount)
    case BUDGET_GET_FAIL:
      return state.set('budgetAmount', 0)
    default:
      return state
  }
}

/* Get budget */

export function getBudget(orgId) {
  return {
    types: [BUDGET_GET, BUDGET_GET_SUCCESS, BUDGET_GET_FAIL],
    promise: (client) => client.get(`/v1/${orgId}/budget`)
  }
}
