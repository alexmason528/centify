import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import styles from './styles.module.css'
import hoc from './hoc'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'

class DashEdit extends Component {

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get users
      const { getUsers, loadedUsers } = this.props
      if (!loadedUsers) {
        getUsers(profile.centifyOrgId)
      }
      // Get todos
      const { getTodos, loadedTodos } = this.props
      if (!loadedTodos) {
        getTodos(profile.centifyOrgId)
      }
      // Get dash
      if (this.props.params.dashId) {
        this.props.getDash(profile.centifyOrgId, this.props.params.dashId)
      }
    }
  }

  initialValues() {
    const { currentDash } = this.props
    if (currentDash.get('Id')) {
      const _rewards = currentDash.get('Rewards')
      const _participants = currentDash.get('Participants')
      const _todos = currentDash.get('ToDos')
      return {
        Name : currentDash.get('Name'),
        Type : currentDash.get('Type'),
        MeasureType : currentDash.getIn(['Measure', 'EventType'], ''),
        MeasureValue : currentDash.getIn(['Measure', 'Value'], 0),
        StartsAt: currentDash.get('StartsAt'),
        EndsAt: currentDash.get('EndsAt'),
        // durationDays : 0,
        // durationHours : 0,
        RewardType : "All over the line",
        RewardAmount : 0,
        rewards: JSON.stringify(_rewards ? _rewards : []),
        participants: JSON.stringify(_participants ? _participants : []),
        todos: JSON.stringify(_todos ? _todos : []),
      }
    } else {
      return {
        Name : "",
        Type : "OverTheLine",
        MeasureType : "Deal",
        MeasureValue : 0,
        StartsAt: formatDate2(),
        EndsAt: formatDate2(),
        // durationDays : 0,
        // durationHours : 0,
        RewardType : "All over the line",
        RewardAmount : 0,
        rewards: null,
        participants: null,
        todos: null,
      }
    }
  }

  todosList = (todoValues) => {
    const list = []
    const { todos } = this.props
    todoValues.map((todoValue, index) => {
      const todoData = todos.get(index).toJS()
      const todo = { 
        selected: todoValue.value,
        existed: todoValue.existed,
        ...todoData
      }
      list.push(todo)
    })
    return list
  }

  onSubmit = (model) => {
    const auth = this.props.auth
    const profile = auth.getProfile()
    const { MeasureType, MeasureValue, rewards, participants, todos, ...modelData } = model
    const data = {
      Description : "",
      ImageURL : "",
      IsTeamDash : false,
      GameType : "RocketLaunch",
      TargetThreshold : model.MeasureValue,
      QualifyingThreshold : 3,
      VelocityAccelTimePeriod : "month",
      ScoreFormula : "",
      ScoreUnits : "string",
      IsPublic : false,
      AreRewardsShared : false,
      AreTeamRewardsShared : false,
      MinimumParticipants : 1,
      MinimumUsersInTeam : 1,
      Measure : {
        Name : "string",
        EventType : model.MeasureType,
        FilterCondition : "string",
        CalcMethod : "Sum",
        SumFields : "string",
        Units : "string",
        "Value": 0,
      },
      IsBash : false,
      DashIdAssociatedToBash : null,
      rewards: JSON.parse(rewards),
      participants: JSON.parse(participants),
      todos: this.todosList(JSON.parse(todos)),
      ...modelData
    }
    this.props.updateDash(profile.centifyOrgId, this.props.params.dashId, data)
  }

  render() {
    const { loading, loadingParticipants, loadingRewards, loadingTodos, loadingUsers, users, todos } = this.props
    if (loading || loadingParticipants || loadingRewards || loadingTodos || loadingUsers) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <DashForm
          onSubmit={(model) => this.onSubmit(model)}
          initialValues={this.initialValues()}
          users={users}
          todos={todos} />
      </div>
    )
  }

}

export default hoc(DashEdit);
