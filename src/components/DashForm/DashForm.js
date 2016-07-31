import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import {Icon} from 'react-fa'
import { 
  Grid, Row, Col,
  Select, Option,
  Input, DateInput,
  Checkbox, CheckboxGroup,
  Button,
  Container,
} from 'react-lightning-design-system'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'

class DashForm extends Component {

  nameInput = (props) => {
    return (
      <Input type="text" {...props.input}/>
    )
  }

  themeSelect = (name) => {
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={name} component="select" className="slds-select">
              <option value="">- Select Type -</option>
              <option value='OverTheLine'>Over the Line</option>
              <option value='TugOfWar'>Tug of War</option>
              <option value='Timebomb'>Time Bomb</option>
            </Field>
          </div>
        </div>
      </div>
    )
  }

  metricSelect = (name) => {
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={name} component="select" className="slds-select">
              <option value="">- Select Metric -</option>
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
    const value = props.input.value ? props.input.value : 0
    const valueStyle = {
      display: 'inline-block',
      width: 100,
      marginLeft: 15,
    }
    return (
      <div>
        <span>What is the target value (use slider to set)? </span>
        <Input type="text" value={value} readOnly style={valueStyle}/>
        <div className="slds-p-top--medium">
          <Slider min={0} max={100} step={1} {...props.input}/>
        </div>
      </div>
    )
  }

  dateInput = (props) => {
    const {value, ...otherProps} = props
    const dateValue = value ? value : new Date().toString()
    return (
      <DateInput value={dateValue} {...otherProps} includeTime/>
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
    return (
      <div className="slds-m-top--medium">
        <Button type="brand">Add Reward</Button>
        <div className="slds-card slds-m-top--medium">
          <div className="slds-card__body">
            <div className="slds-card__body--inner slds-p-vertical--medium">
              <table>
                <tbody>
                  <tr>
                    <td className="slds-p-right--medium" style={{ width: '100%' }}><Input type="text" value={1} readOnly/></td>
                    <td style={{ minWidth: 150 }}><Input type='number' value={200}/></td>
                  </tr>
                  <tr>
                    <td className="slds-p-right--medium"><Input type="text" value={2} readOnly/></td>
                    <td><Input type='number' value={150}/></td>
                  </tr>
                  <tr>
                    <td className="slds-p-right--medium"><Input type="text" value={3} readOnly/></td>
                    <td><Input type='number' value={100}/></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  todoList = (props) => {
    return (
      <div>
      </div>
    )
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const optionsContainerStyle = {
      overflow: 'auto',
      padding: 15,
      border: '1px solid #d8dde6',
      borderRadius: 3,
      height: 150
    }
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
                  {this.themeSelect("Type")}
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
                  {this.metricSelect("MeasureType")}
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
                  <div className="slds-m-bottom--x-small">Calculated Duration</div>
                  <div>
                    <Field name="durationDays" component={this.inlineInput}/> Days&nbsp;&nbsp;&nbsp;
                    <Field name="durationHours" component={this.inlineInput}/> Hours
                  </div>
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 4 - Set the Keywords</h2>
                </Col>
                <Col padded cols={6} colsMedium={4}>
                  <div className="slds-form-element slds-m-bottom--xxx-small">
                    <div className="slds-form-element__control">
                      <label className="slds-checkbox">
                        <Field component="input" type="checkbox" name="allOverTheLine"/>
                        <span className="slds-checkbox--faux"></span>
                        <span className="slds-form-element__label">All participants must be over the line to win the reward</span>
                      </label>
                    </div>
                  </div>
                  <div className="slds-form-element slds-m-bottom--xxx-small">
                    <div className="slds-form-element__control">
                      <label className="slds-checkbox">
                        <Field component="input" type="checkbox" name="anyOverTheLine"/>
                        <span className="slds-checkbox--faux"></span>
                        <span className="slds-form-element__label">Any participants over the line to win the reward</span>
                      </label>
                    </div>
                  </div>
                  <div className="slds-form-element slds-m-bottom--xxx-small">
                    <div className="slds-form-element__control">
                      <label className="slds-checkbox">
                        <Field component="input" type="checkbox" name="oneRewardOnly"/>
                        <span className="slds-checkbox--faux"></span>
                        <span className="slds-form-element__label">Only one winner</span>
                      </label>
                    </div>
                  </div>
                  <div className="slds-form-element slds-m-bottom--xxx-small">
                    <div className="slds-form-element__control">
                      <label className="slds-checkbox">
                        <Field component="input" type="checkbox" name="multipleRewards"/>
                        <span className="slds-checkbox--faux"></span>
                        <span className="slds-form-element__label">Specify the rewards for each winning position</span>
                      </label>
                    </div>
                  </div>
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
                  What is the reward amount?
                  <Field name="rewardAmount" component={this.rewardInput}/>
                </Col>
                <Col padded cols={6}>
                  {this.rewardList()}
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 5 - Select the Todos</h2>
                </Col>
                <Col padded cols={6}>
                  <div className="slds-m-bottom--small">Select one or more Todos for this dash</div>
                  <Checkbox className="slds-m-bottom--x-small" label='Select all'/>
                  <div style={optionsContainerStyle}>
                    <Checkbox className="slds-m-bottom--x-small" label='1. Opportunities that have been "pushed" multiple times'/>
                    <Checkbox className="slds-m-bottom--x-small" label="2. Opportunities that are older than specified period"/>
                    <Checkbox className="slds-m-bottom--x-small" label="3. Opportunities stuck in a particular status"/>
                    <Checkbox className="slds-m-bottom--x-small" label="4. Opportunities that close soon without activities"/>
                    <Checkbox className="slds-m-bottom--x-small" label="5. etc."/>
                  </div>
                </Col>
              </Row>

              <Row cols={6} className="slds-m-top--xx-large">
                <Col padded cols={6} className="slds-m-bottom--medium">
                  <h2 className={styles.fieldTitle}>Step 6 - Add the Participants</h2>
                </Col>
                <Col padded cols={6}>
                  <div className="slds-clearfix slds-m-bottom--small">
                    <div className="slds-float--left">10 items - Last updated 07/28/2016 at 22:10</div>
                    <div className="slds-float--right"><Button type="brand">Select Users</Button></div>
                  </div>
                  <div style={optionsContainerStyle}>
                    <Select className="slds-m-bottom--x-small" defaultValue={ 1 } required style={{ maxWidth: 300 }}>
                      <Option value={ 1 }>User 1</Option>
                      <Option value={ 2 }>User 2</Option>
                      <Option value={ 3 }>User 3</Option>
                    </Select>
                    <Select className="slds-m-bottom--x-small" defaultValue={ 1 } required style={{ maxWidth: 300 }}>
                      <Option value={ 1 }>User 1</Option>
                      <Option value={ 2 }>User 2</Option>
                      <Option value={ 3 }>User 3</Option>
                    </Select>
                    <Select className="slds-m-bottom--x-small" defaultValue={ 1 } required style={{ maxWidth: 300 }}>
                      <Option value={ 1 }>User 1</Option>
                      <Option value={ 2 }>User 2</Option>
                      <Option value={ 3 }>User 3</Option>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Row cols={6} className="slds-m-vertical--x-large">
                <Col padded>
                  <div style={{ textAlign: 'right' }}>
                    <Button type="neutral">Cancel</Button>
                    <button type="submit" className="slds-button slds-button--brand">Save Dash</button>
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

export default reduxForm({
  form: 'DashForm'
})(DashForm);
