import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm, formValueSelector } from 'redux-form'
import { Icon } from 'react-fa'
import {
  Grid, Row, Col,
  Select, Option,
  Input,
  Checkbox, CheckboxGroup,
  Button,
  Container,
  Textarea
} from 'react-lightning-design-system'

import { formatDate2, numWithSurfix } from 'utils/formatter'
import DateInput from 'components/DateInput/DateInput'
import FilterConditionInput from 'components/FilterConditionInput/FilterConditionInput'
import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'


class DashForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedAllTodos: false,
      selectedUserId: 0,
      description: ''
    }
  }

  atoi(str) {
    return str ? parseInt(str) : 0;
  }

  nameInput = (props) => {
    return (
      <Input type="text" {...props.input}/>
    )
  }

  descriptionInput = (props) => {
    return (
      <Textarea {...props.input} />
    )
  }

  typeSelect = ({ DashTypeId, RewardType }) => {
    const { dashtypes } = this.props
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <select
              className="slds-select"
              value={DashTypeId.input.value}
              onChange={e => {
                const dtid = e.currentTarget.value
                DashTypeId.input.onChange(dtid)
                RewardType.input.onChange(dashtypes.getIn([dtid, 'RewardType']))
              }}>
              <option value="">- Select SPIFF competition -</option>
              {dashtypes.valueSeq().map((type, index) => (
                <option key={index} value={type.get('Id')}>{type.get('Name')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }

  themeSelect = () => {
    const { dashbanners } = this.props
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"DashBannerId"} component="select" className="slds-select">
              <option value="">- Select theme -</option>
              {
                dashbanners.valueSeq().map((banner, index) => {
                  const name = banner.get('Name')
                  return (
                    <option key={index} value={banner.get('Id')}>{name}</option>
                  )
                })
              }
            </Field>
          </div>
        </div>
      </div>
    )
  }

  gameTypeSelect = () => {
    const { gametypes, dashtypes, dashbanners, DashTypeId } = this.props
    const dashType = dashtypes.get(DashTypeId)
    const gameTypesAllowed = dashType ? dashType.get('GameTypesAllowed') : false
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"GameTypeId"} component="select" className="slds-select">
              <option value="">- Select Game Type -</option>
              {
                gameTypesAllowed ?
                gametypes.valueSeq().map((game, index) => {
                  const id = game.get('Id')
                  return (
                    gameTypesAllowed.find(t => t == id) ?
                    <option key={index} value={id}>{game.get('Name')}</option>
                    :
                    undefined
                  )
                })
                :
                undefined
              }
            </Field>
          </div>
        </div>
      </div>
    )
  }

  getAmountFieldId = (fieldName) => {
    const { schemas } = this.props
    const fields = schemas.getIn([fieldName, 'Fields'])
    if (!fields) {
      return false
    }
    let id = false
    fields.map(field => {
      if (field.get('Name') == 'Amount') {
        id = field.get('Id')
      }
    })
    return id
  }

  measureTargetInput = ({ MeasureCalcMethod, MeasureSumField, TargetThreshold, MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterConditionType }) => {
    let fieldName = 'Deal'
    if (MeasureEventType.input.value == 'advanced') {
      if (!MeasureFilterConditionType.input.value) {
        fieldName = MeasureEventTypeAdvanced.input.value
      }
    } else {
      fieldName = MeasureEventType.input.value
    }
    const fieldNamePlural = fieldName + 's'
    const midTextSelectStyle = {
      display: 'inline-block',
      maxWidth: 100,
    }
    const amountFieldId = this.getAmountFieldId(fieldName)
    return (
      <fieldset className="slds-form-element">
        <div>What is the target?</div>
        <div className="slds-form-element__control">
          {
            amountFieldId ?
            <label className="slds-radio slds-m-top--medium">
              <input
                type="radio"
                name="options"
                checked={MeasureCalcMethod.input.value == 'add'}
                onChange={e => {
                  MeasureCalcMethod.input.onChange('add')
                  MeasureSumField.input.onChange(amountFieldId)
                }} />
              <span className="slds-radio--faux"></span>
              <span className="slds-form-element__label" style={{ color: 'inherit' }}>
                Value of the {fieldNamePlural}: $&nbsp;
                <Input
                  value={MeasureCalcMethod.input.value == 'add' ? TargetThreshold.input.value : 0}
                  style={midTextSelectStyle}
                  onChange={e => {
                    if (MeasureCalcMethod.input.value == 'add') {
                      TargetThreshold.input.onChange(this.atoi(e.currentTarget.value))
                    }
                  }} />
              </span>
            </label>
            :
            ''
          }
          <label className="slds-radio slds-m-top--medium">
            <input
              type="radio"
              name="options"
              checked={MeasureCalcMethod.input.value == 'increment'}
              onChange={e => {
                MeasureCalcMethod.input.onChange('increment')
                MeasureSumField.input.onChange(null)
              }} />
            <span className="slds-radio--faux"></span>
            <span className="slds-form-element__label" style={{ color: 'inherit' }}>
              Number of {fieldNamePlural}:&nbsp;
              <Input
                value={MeasureCalcMethod.input.value == 'increment' ? TargetThreshold.input.value : 0}
                style={midTextSelectStyle}
                onChange={e => {
                  if (MeasureCalcMethod.input.value == 'increment') {
                    TargetThreshold.input.onChange(this.atoi(e.currentTarget.value))
                  }
                }} />
            </span>
          </label>
        </div>
      </fieldset>
    )
  }

  targetThresholdInput = (props) => {
    const {value, ...otherProps} = props.input
    const _value = value ? value : 0
    const valueStyle = {
      maxWidth: 400,
      marginTop: 5,
      display: 'block',
    }
    return (
      <div>
        <span>Target Threshold value</span>
        <Input type="text" style={valueStyle} {...props.input}/>
      </div>
    )
  }

  dateInput = (props) => {
    return (
      <DateInput {...props.input} />
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

  // rewardTypeSelect = () => {
  //   return (
  //     <div className="slds-form-element">
  //       <div className="slds-form-element__control">
  //         <div className="slds-select_container">
  //           <Field name="RewardType" component="select" className="slds-select">
  //             <option value="">- Select Reward Type -</option>
  //             <option value="All over the line">All participants must be over the line to win the reward</option>
  //             <option value="Any over the line">Any participants over the line to win the reward</option>
  //             <option value="One reward only">Only one winner</option>
  //             <option value="Multiple reward positions">Specify the rewards for each winning position</option>
  //           </Field>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  rewardInput = (props) => {
    const value = props.input.value ? props.input.value : 0
    const rewardInputStyle = {
      display: 'inline-block',
      width: 100,
      marginLeft: 20,
    }
    return (
      <Input type="text" style={rewardInputStyle}
        value={value}
        onChange={e => {
          props.input.onChange(parseInt(e.currentTarget.value))
        }} />
    )
  }

  rewardList = (props) => {
    const { value, onChange } = props.input
    const rewards = value ? JSON.parse(value) : []
    const rewardsCount = rewards.filter(reward => !reward.deleted).length
    let rewardIndex = 0
    return (
      <div className="slds-m-top--medium">
        <Button type="brand" onClick={() => {
          rewards.push({
            Type: "Cash",
            Description: "",
            Position: rewardsCount + 1,
            EstimatedRewardAmount: 0,
            MaximumRewardAmount: 0,
            ExternalURL: "",
            Formula: "{\"Value\": 0}",
            saveStatus: 1,  // 0: saved, 1: new, 2: modified
            deleted: false,
          })
          onChange(JSON.stringify(rewards))
        }}>Add Reward</Button>
        <div className="slds-m-top--medium">
          <table className="slds-table slds-table--bordered slds-table--cell-buffer">
            <thead>
              <tr className="slds-text-heading--label">
                {
                  this.props.editable ?
                  <th scope="col">
                    <div className="slds-truncate" title="Action">Action</div>
                  </th>
                  :
                  ''
                }
                <th scope="col">
                  <div className="slds-truncate" title="Participant">Participant</div>
                </th>
                <th scope="col">
                  <div className="slds-truncate" title="Reward">Reward ($)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward, index) => {
                if (reward.deleted) {
                  return undefined
                }
                reward.Position = ++rewardIndex
                return (
                  <tr key={index}>
                    {
                      this.props.editable?
                      <td data-label="Action">
                        {
                          rewardsCount == reward.Position ?
                          <a
                            href="javascript:void(0)"
                            onClick={e => {
                              if (rewards[index].saveStatus == 1) {
                                rewards.splice(index, 1)       // Remove if newly created and not saved
                              } else {
                                rewards[index].deleted = true  // Set deleted flag
                              }
                              onChange(JSON.stringify(rewards))
                            }}>
                            Remove
                          </a>
                          :
                          undefined
                        }
                      </td>
                      :
                      undefined
                    }
                    <td data-label="Position">
                      {numWithSurfix(reward.Position)}
                    </td>
                    <td data-label="Reward Amount">
                      <Input type='number' defaultValue={reward.EstimatedRewardAmount} onChange={(e) => {
                        rewards[index].Formula = "{\"Value\": " + this.atoi(e.currentTarget.value) + "}"
                        rewards[index].EstimatedRewardAmount = this.atoi(e.currentTarget.value)
                        rewards[index].MaximumRewardAmount = this.atoi(e.currentTarget.value)
                        if (rewards[index].saveStatus == 0) {
                          rewards[index].saveStatus = 2
                        }
                        onChange(JSON.stringify(rewards))
                      }}/>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  calcEstimatedRewardAmount = () => {
    let thisDash = 0
    const { RewardType, RewardAmount, rewards } = this.props
    if (RewardType == 'Limited number of different rewards') {
      const _rewards = rewards ? JSON.parse(rewards) : []
      for(let i = 0; i < _rewards.length; i++) {
        if (!_rewards[i].deleted) {
          thisDash += _rewards[i].EstimatedRewardAmount ? this.atoi(_rewards[i].EstimatedRewardAmount) : 0
        }
      }
    } else {
      thisDash = RewardAmount
    }
    return thisDash
  }

  todoList = (props) => {
    const { value, onChange } = props.input
    const { selectedAllTodos } = this.state
    const todos = value ? JSON.parse(value) : []
    const allTodos = this.props.todos
    const helpIconStyle = {
      fontSize: '1.3em',
      verticalAlign: 'middle',
      color: '#7cc74c',
    }
    return (
      <div>
        <div className="slds-m-bottom--small">Select one or more Todos for this SPIFF</div>
        <Checkbox
          className="slds-m-bottom--x-small"
          label='Select all'
          checked={!!selectedAllTodos}
          onChange={(e) => {
            const selectedAll = e.currentTarget.checked
            for(let i = 0; i < allTodos.size; i++) {
              todos[i] = todos[i] ? todos[i] : { value: false, existed: false }
              todos[i].value = selectedAll
            }
            this.setState({
              selectedAllTodos: selectedAll
            })
            onChange(JSON.stringify(todos) + ' ')
          }} />
        <div className="slds-m-top--medium">
          {allTodos.map((todo, index) => (
            <div key={index}>
              <div className={styles.todoCheckbox}>
                <Checkbox
                  className="slds-m-bottom--x-small"
                  label={(index + 1) + '. ' + todo.get('Name')}
                  checked={!!todos[index] && !!todos[index].value}
                  onChange={(e) => {
                    todos[index] = todos[index] ? todos[index] : { value: false, existed: false }
                    todos[index].value = e.currentTarget.checked
                    if (!todos[index].value) {
                      this.setState({
                        selectedAllTodos: false
                      })
                    }
                    onChange(JSON.stringify(todos))
                  }} />
              </div>
              <span className={styles.todoHelpIconWrapper}>
                <a href="javascript:void(0)">
                  <Icon name="question-circle" style={helpIconStyle} />
                </a>
                <div className={'slds-popover slds-nubbin--left ' + styles.todoHelpPopover} role="dialog">
                  <div className="slds-popover__body">
                    <p>{todo.get('Description')}</p>
                  </div>
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  participantList = (props) => {
    const participantStyle = {
      maxWidth: 450,
    }
    const userSelectStyle = {
      maxWidth: 300,
      marginRight: 10,
      display: 'inline-block',
    }
    const closeIconStyle = {
      width: 16,
      height: 16,
    }
    const users = this.props.users
    const sortedUsers = users.sort((a, b) => a.get('DisplayName').localeCompare(b.get('DisplayName')))
    const { value, onChange } = props.input
    const participants = value ? JSON.parse(value) : []
    const { selectedUserId } = this.state
    return (
      <div>
        <div className="slds-clearfix slds-m-bottom--small">
          <div className="slds-float--left slds-p-vertical--x-small">Total Participants: {participants.filter(p => (!p.deleted)).length}</div>
          <div className="slds-float--right">
            <div style={userSelectStyle}>
              <Select
                className="slds-m-bottom--x-small"
                defaultValue={selectedUserId}
                required
                style={userSelectStyle}
                onChange={(e) => {
                  this.setState({
                    selectedUserId: e.currentTarget.value
                  })
                }}>
                <Option value={0}>-- Select user to add --</Option>
                {
                  sortedUsers.valueSeq().map((user, index) => (
                    <Option key={index} value={user.get('Id')}>{user.get('DisplayName')}</Option>
                  ))
                }
              </Select>
            </div>
            <Button type="brand" onClick={() => {
              const { selectedUserId } = this.state
              let dup = false, dupIndex = -1
              for(let i = 0; i < participants.length; i++) {
                if (participants[i].Users[0].UserId == users.get(selectedUserId).get('Id')) {
                  dup = true
                  dupIndex = i
                  break
                }
              }
              if (!dup) {
                if (selectedUserId) {
                  participants.push({
                    Type: "User",
                    DisplayName: "",
                    Name: users.get(selectedUserId).get('FirstName') + ' ' + users.get(selectedUserId).get('LastName'),
                    AvatarURL: users.get(selectedUserId).get('AvatarURL'),
                    Email: users.get(selectedUserId).get('Email'),
                    Users: [{
                      UserId: users.get(selectedUserId).get('Id'),
                    }],
                    saveStatus: 1,  // 0: saved, 1: new, 2: modified
                    deleted: false,
                  })
                  onChange(JSON.stringify(participants))
                }
              } else {
                participants[dupIndex].deleted = false
                onChange(JSON.stringify(participants))
              }
            }}>Add User</Button>
          </div>
        </div>
        <div className="slds-m-vertical--medium">
          <table className="slds-table slds-table--bordered slds-table--cell-buffer">
            <thead>
              <tr className="slds-text-heading--label">
                {
                  this.props.editable ?
                  <th scope="col">
                    <div className="slds-truncate" title="Action">Action</div>
                  </th>
                  :
                  undefined
                }
                <th scope="col">
                  <div className="slds-truncate" title="Participant">Participant</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => {
                if (participant.deleted) {
                  return ''
                }
                const user = users.get(participant.Users[0].UserId)
                const username = user ? user.get('FirstName') + ' ' + user.get('LastName') : "(Unknown)"
                const avatar = user ? user.get('AvatarURL') : ''
                const email = user ? user.get('Email') : ''
                return (
                  <tr key={index}>
                    {
                      this.props.editable ?
                      <td data-label="Action">
                        <a
                          href="javascript:void(0)"
                          onClick={e => {
                            if (participants[index].saveStatus == 1) {
                              participants.splice(index, 1)       // Remove if newly created and not saved
                            } else {
                              participants[index].deleted = true  // Set deleted flag
                            }
                            onChange(JSON.stringify(participants))
                          }}>
                          Remove
                        </a>
                      </td>
                      :
                      undefined
                    }
                    <td data-label="Participant">
                      <div className="slds-tile slds-media" style={participantStyle}>
                        <div className="slds-media__figure">
                          <span className="slds-avatar slds-avatar--circle slds-avatar--small">
                            <img src={avatar} alt={username} />
                          </span>
                        </div>
                        <div className="slds-media__body">
                          <h3 className="slds-truncate" title={username}>{username}</h3>
                          <div className="slds-tile__detail slds-text-body--small">
                            <dl className="slds-dl--horizontal">
                              <dt className="slds-dl--horizontal__label" style={{ maxWidth: 50 }}>
                                <p className="slds-truncate" title="Email">Email:</p>
                              </dt>
                              <dd className="slds-dl--horizontal__detail slds-tile__meta">
                                <p className="slds-truncate" title={email}>{email}</p>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render() {
    const { handleSubmit, submitting, RewardType, RewardAmount, editable, budgetAmount, description, MeasureEventType, errors } = this.props
    const { schemas } = this.props
    const value = this.calcEstimatedRewardAmount()
    const errorStyle = {
      color: '#ff5d07'
    }
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: 1030 }}>
        <Grid>
          {
            errors ?
            <Row cols={6} className="slds-m-top--large">
              <Col padded cols={6} className="slds-m-bottom--small">
                <div style={errorStyle}>
                  <h2 className={styles.fieldTitle}>Error saving SPIFF</h2>
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error.Message}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
            :
            undefined
          }

          <Row cols={6} className="slds-m-top--large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>SPIFF name</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              <Field name="Name" component={this.nameInput}/>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}>
            </Col>
          </Row>

          <Row cols={6} className="slds-m-top--large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Description</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              <Field name="Description" component={this.descriptionInput} />
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}>
            </Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Competition</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              <Fields
                names={[
                  'DashTypeId',
                  'RewardType',
                ]}
                component={this.typeSelect} />
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}></Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Game</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              {this.gameTypeSelect()}
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}></Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Theme</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              {this.themeSelect()}
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}></Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Goal</h2>
            </Col>
            <Col padded cols={6}>
              <Fields
                names={[
                  'MeasureEventType',
                  'MeasureEventTypeAdvanced',
                  'MeasureFilterCondition',
                  'MeasureFilterCondition1',
                  'MeasureFilterConditionType',
                ]}
                component={FilterConditionInput}
                props={{ schemas }} />
            </Col>
            <Col padded cols={6} className="slds-m-top--large">
              <Fields
                names={[
                  'MeasureCalcMethod',
                  'MeasureSumField',
                  'TargetThreshold',
                  'MeasureEventType',
                  'MeasureEventTypeAdvanced',
                  'MeasureFilterConditionType',
                ]}
                component={this.measureTargetInput} />
            </Col>
          </Row>

          {/*<Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--medium">
              <h2 className={styles.fieldTitle}>Target Threshold</h2>
            </Col>
            <Col padded cols={6}>
              <Field name="TargetThreshold" component={this.targetThresholdInput}/>
            </Col>
          </Row>*/}

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--medium">
              <h2 className={styles.fieldTitle}>Duration</h2>
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
              <h2 className={styles.fieldTitle}>Rewards</h2>
            </Col>
            <Col padded cols={6} colsMedium={2}>
              <table>
                <tbody>
                  <tr style={budgetAmount == 0 ? { display: 'none' } : {}}>
                    <td>Your Budget: </td><td><strong>${budgetAmount}</strong></td>
                  </tr>
                  <tr>
                    <td>This SPIFF: </td><td><strong>${value}</strong></td>
                  </tr>
                  <tr style={budgetAmount == 0 ? { display: 'none' } : {}}>
                    <td>Balance: </td><td><strong>${budgetAmount - value}</strong></td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col padded cols={6} className="slds-m-top--small">
              {
                RewardType == 'Limited number of different rewards' ?
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
              <h2 className={styles.fieldTitle}>Todos</h2>
            </Col>
            <Col padded cols={6}>
              <Field name="todos" component={this.todoList} />
            </Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--medium">
              <h2 className={styles.fieldTitle}>Participants</h2>
            </Col>
            <Col padded cols={6}>
              <Field name="participants" component={this.participantList} />
            </Col>
          </Row>

          <Row cols={6} className="slds-m-vertical--x-large">
            <Col padded>
              <div style={{ textAlign: 'right' }}>
                <Link to='/spiffs' style={{ marginRight: 10, display: 'inline-block' }}>
                  <Button type="neutral">Cancel</Button>
                </Link>
                <button type="submit" className="slds-button slds-button--brand" disabled={!editable || submitting}>Save SPIFF</button>
              </div>
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
      DashTypeId: selector(state, 'DashTypeId'),
      RewardType: selector(state, 'RewardType'),
      RewardAmount: selector(state, 'RewardAmount'),
      rewards: selector(state, 'rewards'),
      MeasureEventType: selector(state, 'MeasureEventType'),
      description: selector(state, 'Description')
    }
  }
)(_DashForm)

export default _DashForm
