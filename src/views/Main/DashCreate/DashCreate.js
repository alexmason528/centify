import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import styles from './styles.module.css'
import hoc from './hoc'
import DashForm from 'components/DashForm/DashForm'
import { formatDate2 } from 'utils/FormatDate'

class DashCreate extends Component {

  initialValues() {
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
      rewards: [],
      participants: [],
      todos: [],
    }
  }

  onSubmit = (model) => {
    const auth = this.props.auth
    const profile = auth.getProfile()
    const { rewards, participants, todos, ...modelData } = model
    const data = {
      Description : "",
      ImageURL : "",
      IsTeamDash : false,
      GameType : "RocketLaunch",
      TargetThreshold : 300,
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
    this.props.createDash(profile.centifyOrgId, data)
  }

  render() {
    const { currentDash } = this.props
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <DashForm onSubmit={(model) => this.onSubmit(model)} initialValues={this.initialValues()}/>
      </div>
    )
  }

}

export default hoc(DashCreate);
