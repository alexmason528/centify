import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import styles from './styles.module.css'
import hoc from './hoc'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/formatter'

class DashEdit extends Component {

  componentDidMount() {
    if (this.props.params.dashId) {
      const auth = this.props.auth
      if (auth) {
        const profile = auth.getProfile()
        this.props.getDash(profile.centifyOrgId, this.props.params.dashId)
      }
    }
  }

  initialValues() {
    const { currentDash } = this.props
    if (currentDash.get('Id')) {
      const _rewards = currentDash.get('Rewards')
      const _participants = currentDash.get('Participants')
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
        todos: null,
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

  onSubmit = (model) => {
    const auth = this.props.auth
    const profile = auth.getProfile()
    const { MeasureType, MeasureValue, ...modelData } = model
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
      ...modelData
    }
    this.props.updateDash(profile.centifyOrgId, this.props.params.dashId, data)
  }

  render() {
    const { currentDash, loading, loadingParticipants, loadingRewards } = this.props
    if (loading || loadingParticipants || loadingRewards) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <DashForm onSubmit={(model) => this.onSubmit(model)} initialValues={this.initialValues()}/>
      </div>
    )
  }

}

export default hoc(DashEdit);
