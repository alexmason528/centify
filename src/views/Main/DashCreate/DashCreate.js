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

  state = {
    errors: false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      errors: false
    })
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
      // Get organization schemas
      const {
        loadedSchemas,
        getSchemas,
      } = this.props
      if (!loadedSchemas) {
        getSchemas(profile.centifyOrgId)
        .catch(() => {
          this.context.notify('Failed to get organization-wide basic filters', 'error')
        })
      }
      // Get game types
      const {
        loadedGameTypes,
        getGameTypes,
      } = this.props
      if (!loadedGameTypes) {
        getGameTypes()
        .catch(() => {
          this.context.notify('Failed to get organization-wide basic filters', 'error')
        })
      }
    }
  }

  initialValues() {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + parseInt(1))
    return {
      Name : "",
      Type : "OverTheLine",
      MeasureEventType : "",
      MeasureEventTypeAdvanced : "",
      MeasureFilterCondition: "",
      MeasureFilterCondition1: "",
      MeasureFilterConditionType: 0,
      TargetThreshold: 0,
      StartsAt: startDate.toISOString(),
      EndsAt: endDate.toISOString(),
      RewardType : "All over the line",
      RewardAmount : 0,
      TargetThreshold: 0,
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

  rewardsArrayCalculate = (rewards, model) => {
    if (model.RewardType == 'Limited number of different rewards') {
      return rewards
    } else {
      const newReward = {
        Type: "Cash",
        Description: "",
        Position: 1,
        EstimatedRewardAmount: parseInt(model.RewardAmount),
        MaximumRewardAmount: parseInt(model.RewardAmount),
        ExternalURL: "",
        Formula: "{}",
        saveStatus: 1,  // 0: saved, 1: new, 2: modified
        deleted: false,
      }
      const newRewards = []
      newRewards.push(newReward)
      for(let i = 1; i < rewards.length; i++) {
        rewards[i].deleted = true
        newRewards.push(rewards[i])
      }
      return newRewards
    }
  }

  onSubmit = (model) => {
    const auth = this.props.auth
    const profile = auth.getProfile()
    const {
      MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition, MeasureFilterCondition1, MeasureFilterConditionType,
      MeasureCalcMethod, MeasureSumField,
      RewardAmount, rewards, participants, todos,
      ...modelData
    } = model
    const measureUnits = (MeasureCalcMethod == 'Add' || MeasureCalcMethod == 'Subtract') ? '$' : MeasureEventType + 's'
    const _rewards = this.rewardsArrayCalculate(rewards ? JSON.parse(rewards) : [], model)
    const data = {
      Description : model.description,
      ImageURL : "",
      IsTeamDash : false,
      QualifyingThreshold : 3,
      VelocityAccelTimePeriod : 30,
      ScoreFormula : "",
      ScoreUnits : measureUnits,
      IsPublic : false,
      AreRewardsShared : false,
      AreTeamRewardsShared : false,
      MinimumParticipants : 1,
      MinimumUsersInTeam : 1,
      Measure : {
        Name : "points",
        EventType: MeasureEventType == 'advanced' ? MeasureEventTypeAdvanced : MeasureEventType,
        FilterCondition: MeasureFilterConditionType ? MeasureFilterCondition1 : MeasureFilterCondition,
        CalcMethod : MeasureCalcMethod,
        SumField : MeasureSumField,
        Units : measureUnits,
        Value: 0,
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
      this.setState({
        errors: res.errors
      })
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
      loadingSchemas, schemas,
      loadingGameTypes, gametypes,
    } = this.props
    if (loading || loadingParticipants || loadingRewards
      || loadingUsers || loadingTodos || loadingDashTypes
      || loadingDashBanners || !loadedDashTypes
      || loadingSchemas || loadingGameTypes) {
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
          dashbanners={dashbanners}
          schemas={schemas}
          gametypes={gametypes}
          errors={this.state.errors} />
      </div>
    )
  }

}

export default hoc(DashCreate)
