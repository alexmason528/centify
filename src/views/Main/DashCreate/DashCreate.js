import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'

class DashCreate extends Component {

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get users
      const { users, loadingUsers, loadedUsers } = this.props
      if (!loadedUsers) {
        this.props.getUsers(profile.centifyOrgId)
      }
      // Get todos
      const { getTodos, loadedTodos } = this.props
      if (!loadedTodos) {
        getTodos(profile.centifyOrgId)
      }
      // Get budget
      const { getBudget } = this.props
      getBudget(profile.centifyOrgId)
    }
  }

  initialValues() { 
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
      EstimatedRewardAmount: 0,
      rewards: null,
      participants: null,
      todos: null,
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
    const _rewards = rewards ? JSON.parse(rewards) : []
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
      RewardCount: _rewards.length,
      rewards: _rewards,
      participants: participants ? JSON.parse(participants) : [],
      todos: todos ? this.todosList(JSON.parse(todos)) : [],
      ...modelData
    }
    this.props.createDash(profile.centifyOrgId, data)
  }

  render() {
    const { loading, loadingParticipants, loadingRewards, loadingUsers, loadingTodos, users, todos, budgetAmount } = this.props
    if (loading || loadingParticipants || loadingRewards || loadingUsers || loadingTodos) {
      return (
        <LoadingSpinner/>
      )
    }
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <Grid className="slds-p-vertical--large">
          <Row cols={6}>
            <Col padded cols={6}>
              <h2 className={styles.pageTitle}>Create New Dash</h2>
            </Col>
          </Row>
        </Grid>
        <DashForm
          editable
          onSubmit={(model) => this.onSubmit(model)}
          initialValues={this.initialValues()}
          users={users}
          todos={todos}
          budgetAmount={budgetAmount} />
      </div>
    )
  }

}

export default hoc(DashCreate)
