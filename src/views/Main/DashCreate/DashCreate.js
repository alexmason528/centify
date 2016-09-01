import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'

class DashCreate extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get users
      const { users, loadingUsers, loadedUsers } = this.props
      if (!loadedUsers) {
        this.props.getUsers(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get users from server', 'error')
        })
      }
      // Get todos
      const { getTodos, loadedTodos } = this.props
      if (!loadedTodos) {
        getTodos(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get todos from server', 'error')
        })
      }
      // Get budget
      const { getBudget } = this.props
      getBudget(profile.centifyOrgId)
      // Get dash types
      const { getDashTypes, loadedDashTypes } = this.props
      if (!loadedDashTypes) {
        getDashTypes(profile.centifyOrgId)
        .catch(res => {
          this.context.notify('Failed to get dash types from server', 'error')
        })
      }
      // Get dash banners
      const { getDashBanners, loadedDashBanners } = this.props
      if (!loadedDashBanners) {
        getDashBanners()
        .catch(res => {
          this.context.notify('Failed to get dash banners from server', 'error')
        })
      }
    }
  }

  calcEstimatedRewardAmount = (model) => {
    let thisDash = 0
    const { RewardTypeValue, RewardAmount, rewards } = model
    if (RewardTypeValue == 'Multiple reward positions') {
      const _rewards = rewards ? JSON.parse(rewards) : []
      for(let i = 0; i < _rewards.length; i++) {
        if (!_rewards[i].deleted) {
          thisDash += _rewards[i].EstimatedRewardAmount ? parseInt(_rewards[i].EstimatedRewardAmount) : 0
        }
      }
    } else {
      thisDash = RewardAmount
    }
    return thisDash
  }

  initialValues() {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + parseInt(1))
    return {
      Name : "",
      Type : "OverTheLine",
      MeasureType : "Deal",
      MeasureFilterCondition: 'data["06ry1nbzp9yn6yfj"] == "something" and data["06ry1ncypkco6lcq"] != "something else" and data["06ry1nfslir3u8uu"] < 300 and data["06ry1nfx9ax7oebn"] > 200',
      MeasureValue : 0,
      StartsAt: startDate.toISOString(),
      EndsAt: endDate.toISOString(),
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
      TargetThreshold : parseInt(model.MeasureValue),
      QualifyingThreshold : 3,
      VelocityAccelTimePeriod : 30,
      ScoreFormula : "",
      ScoreUnits : "string",
      IsPublic : false,
      AreRewardsShared : false,
      AreTeamRewardsShared : false,
      MinimumParticipants : 1,
      MinimumUsersInTeam : 1,
      EstimatedRewardAmount: this.calcEstimatedRewardAmount(model),
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
    .then(() => {
      this.context.notify('Dash created successfully', 'success')
    })
    .catch(res => {
      this.context.notify('Failed to create dash due to errors', 'error')
    })
  }

  render() {
    const {
      loading, loadingParticipants, loadingRewards, 
      loadingUsers, users, 
      loadingTodos, todos,
      budgetAmount,
      loadingDashTypes, loadedDashTypes, dashtypes,
      loadingDashBanners, dashbanners,
    } = this.props
    if (loading || loadingParticipants || loadingRewards
      || loadingUsers || loadingTodos || loadingDashTypes
      || loadingDashBanners || !loadedDashTypes) {
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
          todos={todos.filter(todo => !!todo.get('Status'))}
          budgetAmount={budgetAmount}
          dashtypes={dashtypes}
          dashbanners={dashbanners} />
      </div>
    )
  }

}

export default hoc(DashCreate)
