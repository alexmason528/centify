import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import styles from './styles.module.css'
import hoc from './hoc'
import DashForm from 'components/DashForm/DashForm'

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
    return {
      "Description" : null,
      "ImageURL" : null,
      "IsTeamDash" : true,
      "Type" : "OverTheLine",
      "GameType" : "RocketLaunch",
      "TargetThreshold" : 0,
      "QualifyingThreshold" : 0,
      "VelocityAccelTimePeriod" : "string",
      "ScoreFormula" : "string",
      "ScoreUnits" : "string",
      "IsPublic" : "true",
      "RewardType" : "All over the line",
      "AreRewardsShared" : "true",
      "AreTeamRewardsShared" : "true",
      "StartsAt" : new Date().toString(),
      "EndsAt" : new Date().toString(),
      "MinimumParticipants" : 1,
      "MinimumUsersInTeam" : 1,
      "Measure" : {
        "Name" : "string",
        "EventType" : "Deal",
        "FilterCondition" : "string",
        "CalcMethod" : "Sum|Count",
        "SumFields" : "string",
        "Units" : "string",
        "Value" : 0,
      },
      "IsBash" : "True",
      "DashIdAssociatedToBash" : "",
    }
  }

  onSubmit(model) {
    const profile = auth.getProfile()
    const data = {
      ...model
    }
    this.props.createDash(profile.centifyOrgId)
  }

  render() {
    const { currentDash } = this.props
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <DashForm onSubmit={(model) => console.log(model)} initialValues={this.initialValues()}/>
      </div>
    )
  }

}

export default hoc(DashEdit);
