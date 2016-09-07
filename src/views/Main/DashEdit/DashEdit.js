import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'
import styles from './styles.module.css'
import hoc from './hoc'


class DashEdit extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      // Get users
      const { getUsers, loadedUsers } = this.props
      if (!loadedUsers) {
        getUsers(profile.centifyOrgId)
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
      // Get dash
      if (this.props.params.dashId) {
        this.props.getDash(profile.centifyOrgId, this.props.params.dashId)
        .catch(res => {
          this.context.notify('Failed to get dash details from server', 'error')
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
      const eventType = currentDash.getIn(['Measure', 'EventType'], '')
      const filterCond = currentDash.getIn(['Measure', 'FilterCondition'], '')
      const filterIsFirstType = (filterCond.substr(0, 4).toLowerCase() == 'data')
      return {
        Name : currentDash.get('Name'),
        Type : currentDash.get('Type'),
        DashTypeId: currentDash.get('DashTypeId'),
        GameTypeId: currentDash.get('GameTypeId'),
        DashBannerId: currentDash.get('DashBannerId'),
        MeasureEventType: eventType,
        MeasureEventTypeAdvanced : eventType,
        MeasureFilterCondition: filterIsFirstType ? filterCond : '',
        MeasureFilterCondition1: filterIsFirstType ? '' : filterCond,
        MeasureFilterConditionType: filterIsFirstType ? 0 : 1,
        TargetThreshold: currentDash.get('TargetThreshold'),
        StartsAt: new Date(currentDash.get('StartsAt')).toISOString(),
        EndsAt: new Date(currentDash.get('EndsAt')).toISOString(),
        RewardType : "All over the line",
        RewardAmount : 0,
        EstimatedRewardAmount: currentDash.get('EstimatedRewardAmount') ? parseInt(currentDash.get('EstimatedRewardAmount')) : 0,
        rewards: JSON.stringify(_rewards ? _rewards : []),
        participants: JSON.stringify(_participants ? _participants : []),
        todos: JSON.stringify(this.getTodosArrayFromList(_todos ? _todos : [])),
      }
    } else {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + parseInt(1))
      return {
        Name : "",
        Type : "OverTheLine",
        MeasureEventType : "Deal",
        MeasureEventTypeAdvanced : "",
        MeasureFilterCondition: "",
        MeasureFilterCondition1: "",
        MeasureFilterConditionType: 0,
        TargetThreshold : 0,
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

  onSubmit = (model) => {
    console.log('data: ', model)
    const { currentDash } = this.props
    const editable = currentDash.get('Status') && currentDash.get('Status').toLowerCase() == 'draft'
    if (!editable) {
      return
    }
    const auth = this.props.auth
    const profile = auth.getProfile()
    const {
      MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition, MeasureFilterCondition1, MeasureFilterConditionType,
      MeasureCalcMethod, MeasureSumField,
      rewards, participants, todos,
      ...modelData
    } = model
    const _rewards = rewards ? JSON.parse(rewards) : []
    const data = {
      Description : model.description,
      ImageURL : "",
      IsTeamDash : false,
      GameType : "RocketLaunch",
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
        Name: "string",
        EventType: MeasureEventType == 'advanced' ? MeasureEventTypeAdvanced : MeasureEventType,
        FilterCondition: MeasureFilterConditionType ? MeasureFilterCondition1 : MeasureFilterCondition,
        CalcMethod : MeasureCalcMethod,
        SumField : MeasureSumField,
        Units : "string",
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
    this.props.updateDash(profile.centifyOrgId, this.props.params.dashId, data)
    .then(() => {
      this.context.notify('Dash updated successfully', 'success')
    })
    .catch(res => {
      this.context.notify('Failed to update dash due to errors', 'error')
    })
  }

  render() {
    const {
      currentDash, loading, loadingParticipants, loadingRewards,
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
          todos={todos.filter(todo => !!todo.get('Status'))}
          editable={editable}
          budgetAmount={budgetAmount}
          dashtypes={dashtypes}
          dashbanners={dashbanners}
          schemas={schemas}
          gametypes={gametypes} />
      </div>
    )
  }

}

export default hoc(DashEdit)
