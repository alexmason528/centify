import React, { Component } from 'react'
import { Button, Grid, Row, Col, } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'


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

  getTodosArrayFromList = (todos) => {
    const allTodos = this.props.todos
    if (!allTodos) {
      return []
    }
    const todoValues = []
    for(let i = 0; i < allTodos.size; i++) {
      todoValues.push({
        value: false,
        existed: false,
      })
    }
    todos.forEach((todo) => {
      let n = -1
      allTodos.map((a_todo, index) => {
        if (todo.get('ToDoId') == a_todo.get('Id')) {
          n = index
        }
      })
      if (n >= 0) {
        todoValues[n] = {
          value: true,
          existed: true,
        }
      }
    })
    return todoValues
  }

  initialValues() {
    const { currentDash } = this.props
    if (currentDash.get('Id')) {
      const _rewards = currentDash.get('Rewards').sortBy(reward => reward.get('Position'))
      const _participants = currentDash.get('Participants')
      const _todos = currentDash.get('ToDos')
      return {
        Name : currentDash.get('Name'),
        Type : currentDash.get('Type'),
        MeasureType : currentDash.getIn(['Measure', 'EventType'], ''),
        MeasureValue : currentDash.getIn(['Measure', 'Value'], 0),
        StartsAt: new Date(currentDash.get('StartsAt')),
        EndsAt: new Date(currentDash.get('EndsAt')),
        // durationDays : 0,
        // durationHours : 0,
        RewardType : "All over the line",
        RewardAmount : 0,
        rewards: JSON.stringify(_rewards ? _rewards : []),
        participants: JSON.stringify(_participants ? _participants : []),
        todos: JSON.stringify(this.getTodosArrayFromList(_todos ? _todos : [])),
      }
    } else {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + parseInt(1))
      return {
        Name : "",
        Type : "OverTheLine",
        MeasureType : "Deal",
        MeasureValue : 0,
        StartsAt: formatDate2(),
        EndsAt: formatDate2(endDate),
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
      const todoData = todos.get(index)
      const todo = { 
        selected: todoValue.value,
        existed: todoValue.existed,
        ToDoId: todoData.get('Id')
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
      VelocityAccelTimePeriod : 30,
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
      rewards: rewards ? JSON.parse(rewards) : [],
      participants: participants ? JSON.parse(participants) : [],
      todos: todos ? this.todosList(JSON.parse(todos)) : [],
      ...modelData
    }
    this.props.updateDash(profile.centifyOrgId, this.props.params.dashId, data)
  }

  render() {
    const { currentDash, loading, loadingParticipants, loadingRewards, loadingTodos, loadingUsers, users, todos } = this.props
    if (loading || loadingParticipants || loadingRewards || loadingTodos || loadingUsers) {
      return (
        <LoadingSpinner/>
      )
    }
    const editable = currentDash.get('Status') && currentDash.get('Status').toLowerCase() == 'draft'
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <Grid className="slds-p-vertical--large">
          <Row cols={6}>
            <Col padded cols={6}>
              <h2 className={styles.pageTitle}>Edit Dash</h2>
            </Col>
          </Row>
        </Grid>
        <DashForm
          onSubmit={(model) => this.onSubmit(model)}
          initialValues={this.initialValues()}
          users={users}
          todos={todos}
          editable={editable} />
      </div>
    )
  }

}

export default hoc(DashEdit);
