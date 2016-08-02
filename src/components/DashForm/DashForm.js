import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { Icon } from 'react-fa'
import { 
  Grid, Row, Col,
  Select, Option,
  Input,
  Checkbox, CheckboxGroup,
  Button,
  Container,
} from 'react-lightning-design-system'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import DateInput from 'components/DateInput/DateInput'

import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'
import { formatDate2 } from 'utils/formatter'

class DashForm extends Component {

  nameInput = (props) => {
    return (
      <Input type="text" {...props.input}/>
    )
  }

  themeSelect = () => {
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"Type"} component="select" className="slds-select">
              <option value='OverTheLine'>Over the Line</option>
              <option value='TugOfWar'>Tug of War</option>
              <option value='Timebomb'>Time Bomb</option>
            </Field>
          </div>
        </div>
      </div>
    )
  }

  metricSelect = () => {
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"MeasureType"} component="select" className="slds-select">
              <option value="Deal">Deal</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Lead">Lead</option>
              <option value="Account">Account</option>
              <option value="TrailingRevenueComp">Trailing Revenue Comp</option>
            </Field>
          </div>
        </div>
      </div>
    )
  }

  goalSlider = (props) => {
    const {value, ...otherProps} = props.input
    const _value = value ? value : 0
    const valueStyle = {
      display: 'inline-block',
      width: 100,
      marginLeft: 15,
    }
    return (
      <div>
        <span>What is the target value (use slider to set)? </span>
        <Input type="text" value={_value} readOnly style={valueStyle}/>
        <div className="slds-p-top--medium">
          <Slider min={0} max={5000} step={1} value={_value} {...otherProps}/>
        </div>
      </div>
    )
  }

  dateInput = (props) => {
    return (
      <DateInput {...props.input}/>
    )
  }

  inlineInput = (props) => {
    const value = props.input.value ? props.input.value : 0
    const durationInputStyle = {
      display: 'inline-block',
      width: 50,
      marginRight: 6,
    }
    return (
      <Input type="text" {...props.input} style={durationInputStyle}/>
    )
  }

  rewardTypeSelect = () => {
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name="RewardType" component="select" className="slds-select">
              <option value="">- Select Reward Type -</option>
              <option value="All over the line">All participants must be over the line to win the reward</option>
              <option value="Any over the line">Any participants over the line to win the reward</option>
              <option value="One reward only">Only one winner</option>
              <option value="Multiple reward positions">Specify the rewards for each winning position</option>
            </Field>
          </div>
        </div>
      </div>
    )
  }

  rewardInput = (props) => {
    const value = props.input.value ? props.input.value : 0
    const rewardInputStyle = {
      display: 'inline-block',
      width: 100,
      marginLeft: 20,
    }
    return (
      <Input type="text" {...props.input} style={rewardInputStyle}/>
    )
  }

  rewardList = (props) => {
    const { value, onChange } = props.input
    const rewards = value ? JSON.parse(value) : []
    return (
      <div className="slds-m-top--medium">
        <Button type="brand" onClick={() => {
          rewards.push({
            Type: "Cash",
            Description: "",
            Position: rewards.length + 1,
            EstimatedRewardAmount: 0,
            MaximumRewardAmount: 0,
            ExternalURL: "",
            Formula: "",
            saveStatus: 1,  // 0: saved, 1: new, 2: modified
          })
          onChange(JSON.stringify(rewards))
        }}>Add Reward</Button>
        <div className="slds-card slds-m-top--medium">
          <div className="slds-card__body">
            <div className="slds-card__body--inner slds-p-vertical--medium">
              <table>
                <tbody>
                  {rewards.map((reward, index) => (
                    <tr key={index}>
                      <td className="slds-p-right--medium slds-p-bottom--small" style={{ width: '100%' }}>
                        <Input type="text" value={reward.Position} readOnly/>
                      </td>
                      <td className="slds-p-bottom--small" style={{ minWidth: 150 }}>
                        <Input type='number' defaultValue={reward.EstimatedRewardAmount} onChange={(e) => {
                          rewards[index].EstimatedRewardAmount = e.currentTarget.value
                          rewards[index].MaximumRewardAmount = e.currentTarget.value
                          rewards[index].saveStatus = 2
                          onChange(JSON.stringify(rewards))
                        }}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  todoList = (props) => {
    const optionsContainerStyle = {
      overflow: 'auto',
      padding: 15,
      border: '1px solid #d8dde6',
      borderRadius: 3,
      height: 150
    }
    const { value, onChange } = props.input
    const todos = value ? JSON.parse(value) : []
    return (
      <div>
        <div className="slds-m-bottom--small">Select one or more Todos for this dash</div>
        <Checkbox className="slds-m-bottom--x-small" label='Select all'/>
        <div style={optionsContainerStyle}>
          <Checkbox className="slds-m-bottom--x-small" label='1. Opportunities that have been "pushed" multiple times'/>
          <Checkbox className="slds-m-bottom--x-small" label="2. Opportunities that are older than specified period"/>
          <Checkbox className="slds-m-bottom--x-small" label="3. Opportunities stuck in a particular status"/>
          <Checkbox className="slds-m-bottom--x-small" label="4. Opportunities that close soon without activities"/>
          <Checkbox className="slds-m-bottom--x-small" label="5. etc."/>
        </div>
      </div>
    )
  }

  participantList = (props) => {
    const optionsContainerStyle = {
      overflow: 'auto',
      padding: 15,
      border: '1px solid #d8dde6',
      borderRadius: 3,
      height: 150
    }
    const { value, onChange } = props.input
    const participants = value ? JSON.parse(value) : []
    console.log(participants)
    return (
      <div>
        <div className="slds-clearfix slds-m-bottom--small">
          <div className="slds-float--left">{participants.length} participants</div>
          <div className="slds-float--right">
            <Button type="brand" onClick={() => {
              participants.push( {
                Type: "User",
                DisplayName: "string",
                Users: [{
                  UserId: "1", /// user id here
                }],
                saveStatus: 1,  // 0: saved, 1: new, 2: modified
              })
              onChange(JSON.stringify(participants))
            }}>Add User</Button>
          </div>
        </div> 
        <div style={optionsContainerStyle}>
          {
            participants.map((participant, index) => (
              <Select
                key={index}
                className="slds-m-bottom--x-small"
                defaultValue={ participant.Users[0].UserId } 
                required
                style={{ maxWidth: 300 }}
                onChange={(e) => {
                  participants[index].Users[0].UserId = e.currentTarget.value
                  participants[index].Users[0].UserId = e.currentTarget.value
                  participants[index].saveStatus = 2
                  onChange(JSON.stringify(participants))
                }}>
                <Option value={ 1 }>User 1</Option>
                <Option value={ 2 }>User 2</Option>
                <Option value={ 3 }>User 3</Option>
              </Select>
            ))
          }
        </div>
      </div>
    )
  }

  render() {
    const { handleSubmit, submitting, RewardTypeValue } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <Grid>
          <Row cols={6}>
            <Col cols={6} colsSmall={5} colsMedium={4}>

              <Row cols={6} className="slds-m-top--large">
                <Col padded cols={6} className="slds-m-bottom--small">
                  <h2 className={styles.fieldTitle}>Enter Dash name</h2>
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={2}>
                  <Field name="Name" component={this.nameInput}/>
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={4}>
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--small">
                  <h2 className={styles.fieldTitle}>Step 1 - Select Theme</h2>
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={2}>
                  {this.themeSelect()}
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={4}></Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--small">
                  <h2 className={styles.fieldTitle}>Step 2 - Select Goal</h2>
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={1}>
                  What is the metric?
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={2}>
                  {this.metricSelect()}
                </Col>
                <Col padded cols={6} colsSmall={3} colsMedium={2}></Col>
                <Col padded cols={6} className="slds-m-top--medium">
                  <Field name="MeasureValue" component={this.goalSlider}/>
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 3 - Set the Dash</h2>
                  (UTC+10:00) Sydney, Canberra, Melbourne
                </Col>
                <Col padded cols={6} colsMedium={2}>
                  <div className="slds-m-bottom--x-small">Start Date & Time</div>
                  <Field name="StartsAt" component={this.dateInput}/>
                </Col>
                <Col padded cols={6} colsMedium={2}>
                  <div className="slds-m-bottom--x-small">End Date & Time</div>
                  <Field name="EndsAt" component={this.dateInput}/>
                </Col>
                <Col padded cols={6} colsMedium={2}>
                  {/*
                  <div className="slds-m-bottom--x-small">Calculated Duration</div>
                  <div>
                    <Field name="durationDays" component={this.inlineInput}/> Days&nbsp;&nbsp;&nbsp;
                    <Field name="durationHours" component={this.inlineInput}/> Hours
                  </div>
                  */}
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 4 - Set the Keywords</h2>
                </Col>
                <Col padded cols={6} colsMedium={4}>
                  {this.rewardTypeSelect()}
                </Col>
                <Col padded cols={6} colsMedium={2}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Your Budget: </td><td><strong>$10,000</strong></td>
                      </tr><tr>
                        <td>This Dash: </td><td><strong>$6,000</strong></td>
                      </tr><tr>
                        <td>Balance: </td><td><strong>$4,000</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col padded cols={6} className="slds-m-top--small">
                  {
                    RewardTypeValue == 'Multiple reward positions' ?
                    <Field name="rewards" component={this.rewardList} />
                    :
                    <div>
                      What is the reward amount?
                      <Field name="RewardAmount" component={this.rewardInput} />
                    </div>
                  }
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 5 - Select the Todos</h2>
                </Col>
                <Col padded cols={6}>
                  <Field name="todos" component={this.todoList} />
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 6 - Add the Participants</h2>
                </Col>
                <Col padded cols={6}>
                  <Field name="participants" component={this.participantList} />
                </Col>
              </Row>

              <Row cols={6} className="slds-m-vertical--x-large">
                <Col padded>
                  <div style={{ textAlign: 'right' }}>
                    <Button type="neutral">Cancel</Button>
                    <button type="submit" className="slds-button slds-button--brand" disabled={submitting}>Save Dash</button>
                  </div>
                </Col>
              </Row>

            </Col>
            <Col cols={6} colsSmall={1} colsMedium={2}>
            </Col>
          </Row>
        </Grid>
      </form>
    )
  }

}

let _DashForm = reduxForm({
  form: 'DashForm'
})(DashForm)

const selector = formValueSelector('DashForm')
_DashForm = connect(
  state => {
    return {
      RewardTypeValue: selector(state, 'RewardType')
    }
  }
)(_DashForm)

export default _DashForm
