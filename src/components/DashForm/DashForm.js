import React, { Component } from 'react'
import { Link } from 'react-router'
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
import math from 'mathjs'

import { formatDate2, numWithSurfix } from 'utils/formatter'
import DateInput from 'components/DateInput/DateInput'
import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'


class DashForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedAllTodos: false,
      selectedUserId: 0,
    }

    this.convertedBasicFilters = false
  }

  nameInput = (props) => {
    return (
      <Input type="text" {...props.input}/>
    )
  }

  typeSelect = () => {
    const { dashtypes } = this.props
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"DashTypeId"} component="select" className="slds-select">
              <option value="">- Select dash type -</option>
              {dashtypes.valueSeq().map((type, index) => (
                <option key={index} value={type.get('Id')}>{type.get('Name')}</option>
              ))}
            </Field>
          </div>
        </div>
      </div>
    )
  }

  themeSelect = () => {
    const { dashtypes, dashbanners, DashTypeId } = this.props
    const dashType = dashtypes.get(DashTypeId)
    const themesAllowed = dashType ? dashType.get('GameThemesAllowed') : false
    return (
      <div className="slds-form-element">
        <div className="slds-form-element__control">
          <div className="slds-select_container">
            <Field name={"DashBannerId"} component="select" className="slds-select">
              <option value="">- Select theme -</option>
              {
                // themesAllowed ?
                // dashbanners.valueSeq().map((banner, index) => {
                //   const name = banner.get('Name')
                //   return (
                //     themesAllowed.find(t => t == name) ?
                //     <option key={index} value={banner.get('Id')}>{name}</option>
                //     :
                //     undefined
                //   )
                // })
                // :
                // undefined
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

  convertBasicFilters() {
    if (this.convertedBasicFilters) {
      return
    }
    const {
      schemas,
    } = this.props
    for(const k in basicFilters) {
      const filter = basicFilters[k]
      filter.FilterConditionPattern = filter.FilterConditionPattern.replace(/data\[\"([A-Za-z]+)\"\]/g, (v, name) => {
        let id = ''
        schemas.map(schema => {
          if (schema.get('Type') != filter.EventType) {
            return
          }
          const fields = schema.get('Fields')
          if (fields) {
            fields.map(field => {
              if (field.get('Name') == name) {
                id = field.get('Id')
              }
            })
          }
        })
        return v.replace(name, id)
      })
    }
    this.convertedBasicFilters = basicFilters
  }

  assert = (condition, message) => {
    if (!condition) {
      message = message || 'Assertion failed'
      if (typeof Error !== 'undefined') {
        throw new Error(message)
      }
      throw message // Fallback
    }
  }

  parse = (expression) => {
    let matching // All or Any - starts undefined
    let state = 'init' // State machine starts in init
    let expressions = [] // Expressions to store
    let rootNode = math.parse(expression)
    rootNode.traverse((node, path, parent) => {
      switch (node.type) {
        case 'OperatorNode':
          if(node.op == 'and') {
            this.assert(state == 'init', "Unexpected AND - No nested logic permitted")
            this.assert(!matching || (matching === 'all'), "Unexpected AND - Must be all ANDs or all ORs")
            matching = 'all'
          } else if(node.op == 'or') {
            this.assert(state == 'init', "Unexpected OR - No nested logic permitted")
            this.assert(!matching || (matching === 'any'), "Unexpected OR - Must be all ANDs or all ORs")
            matching = 'any'
          } else if(supportedOperators.includes(node.op)) {
            // Now a string of math ops
            state = 'expressions'
            this.assert(node.args[0].object.name == 'data', "Left hand side must be data[]")
            this.assert(node.args[0].index, "Left hand side must be an index into data[]")
            this.assert(node.args[0].index.dimensions.length == 1, "Must be only 1 index into array")
            this.assert(node.args[0].index.dimensions[0].valueType == 'string', "Index into data[] must be a string")
            switch(node.args[1].valueType) {
              case 'string':
                this.assert(supportedStringOperators.includes(node.op), "Unsupported operator for string")
                break
              case 'number':
                this.assert(supportedNumberOperators.includes(node.op), "Unsupported operator for number")
                break
              default:
                throw("Unsupported value - only strings and numbers are supported")
            }
            expressions.push({
              'fieldId': node.args[0].index.dimensions[0].value,
              'operator': node.op,
              'value': node.args[1].value 
            })
          } else {
            throw("Unsupported operator " + node.op)
          }
          break
        case 'ConstantNode':
          break;
        case 'SymbolNode':
          break;
        case 'IndexNode':
          break;
        case 'AccessorNode':
          break;
        default:
          throw("Unexpected element " + node.type)
      }
    });
    return {
      'matching': matching,
      'expressions': expressions
    };
  }

  onChangeBasicFilterSelect = (e, onChange) => {
    this.setState({
      basicFilter: e.currentTarget.value,
    })
    if (e.currentTarget.value != 'advanced') {
      for(const k in this.convertedBasicFilters) {
        const filter = this.convertedBasicFilters[k]
        if (filter.EventType == e.currentTarget.value) {
          onChange(filter.FilterConditionPattern)
          break
        }
      }
    }
  }

  basicFilterSelect = (props) => {
    const basicSelectStyle = {
      maxWidth: 400,
      marginTop: 5,
    }
    const basicFilterOptions = []
    for(const k in this.convertedBasicFilters) {
      const filter = this.convertedBasicFilters[k]
      basicFilterOptions.push(
        <Option key={k} value={filter.EventType}>{filter.EventType}</Option>
      )
    }
    return (
      <div>
        What is the metric?
        <div className="slds-form-element" style={basicSelectStyle}>
          <div className="slds-form-element__control">
            <div className="slds-select_container">
              <Select value={props.input.value} onChange={e => {
                this.onChangeBasicFilterSelect(e, props.input.onChange)
              }>
                {basicFilterOptions}
                <Option value="advanced">Advanced...</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  advancedFilterSelect = (props) => {
    const parsedExpression = this.parse(props.input.value)
    const midTextSelectStyle = {
      display: 'inline-block',
      maxWidth: 100,
      margin: '0 10px',
    }
    const ruleSelectStyle = {
      display: 'inline-block',
      maxWidth: 160,
      marginRight: 15,
    }
    const ruleStyle = {
      padding: '5px 0',
    }
    const ruleButtonStyle = {
      width: 30,
      marginLeft: 5,
      padding: 0,
      textAlign: 'center',
    }
    const {
      schemas
    } = this.props
    return (
      <div className="slds-m-top--medium">
        <div className="slds-form-element">
          <div className="slds-form-element__control">
            <label className="slds-radio">
              <input type="radio" name="options" />
              <span className="slds-radio--faux"></span>
              <span className="slds-form-element__label">
                Include
                <Select style={midTextSelectStyle}>
                  {schemas.valueSeq().map((schema, index) => (
                    <Option key={index} value={schema.get('Id')}>{schema.get('Type')}</Option>
                  ))}
                </Select>
                matching
                <Select style={midTextSelectStyle} value={parsedExpression.matching}>
                  <Option value="all">All</Option>
                  <Option value="any">Any</Option>
                </Select>
                of the following values:
              </span>
            </label>
          </div>
        </div>
        <div style={{ paddingLeft: 35, maxWidth: 700 }}>
          <hr style={{ margin: '20px 0 10px' }} />
          {parsedExpression.expressions.map((expression, index) => {
            return (
              <div style={ruleStyle} key={index}>
                <Select style={ruleSelectStyle} value={expression.fieldId}>
                  {
                    schemas.get('Deal') ?
                    schemas.getIn(['Deal', 'Fields']).valueSeq().map((field, index) => (
                      <Option key={index} value={field.get('Id')}>{field.get('Name')}</Option>
                    ))
                    :
                    undefined
                  }
                </Select>
                <Select style={ruleSelectStyle} value={expression.operator}>
                  <Option value="==">is</Option>
                  <Option value="!=">is not</Option>
                  <Option value=">">is greater than</Option>
                  <Option value="<">is less than</Option>
                </Select>
                <Input type="text" style={ruleSelectStyle} value={expression.value} />
                <div className="slds-float--right">
                  <Button type="icon-border" icon="add" />
                  <Button type="icon-border" icon="dash" />
                </div>
              </div>
            )
          })}
          <hr style={{ margin: '10px 0 20px' }} />
        </div>
        <div className="slds-form-element">
          <div className="slds-form-element__control">
            <label className="slds-radio">
              <input type="radio" name="options" />
              <span className="slds-radio--faux"></span>
              <span className="slds-form-element__label">
                Include deals with
                <Select style={midTextSelectStyle}>
                  <Option value=">=">at least</Option>
                  <Option value="<=">at most</Option>
                  <Option value="=">equals</Option>
                </Select>
                <Input type="text" style={midTextSelectStyle} defaultValue={5} />
                products matching the following rule:
              </span>
            </label>
          </div>
        </div>
        <div style={{ paddingLeft: 35, maxWidth: 700 }}>
          <hr style={{ margin: '20px 0 10px' }} />
          <div style={ruleStyle}>
            <Select style={ruleSelectStyle}>
              <Option value="productcode">Product code</Option>
              <Option value="value">Value</Option>
              <Option value="deals">Deals</Option>
            </Select>
            <Select style={ruleSelectStyle}>
              <Option value="==">is</Option>
              <Option value="!=">is not</Option>
              <Option value=">">is greater than</Option>
              <Option value="<">is less than</Option>
            </Select>
            <Input type="text" style={ruleSelectStyle} />
          </div>
          <hr style={{ margin: '10px 0 20px' }} />
        </div>
      </div>
    )
  }

  measureValueInput = (props) => {
    const {value, ...otherProps} = props.input
    const _value = value ? value : 0
    const valueStyle = {
      maxWidth: 400,
      marginTop: 5,
      display: 'block',
    }
    return (
      <div>
        <span>What is the target value? </span>
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
            Formula: "{}",
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
                        rewards[index].EstimatedRewardAmount = parseInt(e.currentTarget.value)
                        rewards[index].MaximumRewardAmount = parseInt(e.currentTarget.value)
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
    const { RewardTypeValue, RewardAmount, rewards } = this.props
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
        <div className="slds-m-bottom--small">Select one or more Todos for this dash</div>
        <Checkbox
          className="slds-m-bottom--x-small"
          label='Select all'
          checked={selectedAllTodos}
          onChange={(e) => {
            const selectedAll = e.currentTarget.checked
            for(let i = 0; i < allTodos.size; i++) {
              todos[i] = todos[i] ? todos[i] : { value: false, existed: false }
              todos[i].value = selectedAll
            }
            this.setState({
              selectedAllTodos: selectedAll
            })
            onChange(JSON.stringify(todos))
          }} />
        <div className="slds-m-top--medium">
          {allTodos.map((todo, index) => (
            <div key={index}>
              <div className={styles.todoCheckbox}>
                <Checkbox
                  className="slds-m-bottom--x-small"
                  label={(index + 1) + '. ' + todo.get('Name')}
                  checked={todos[index] && !!todos[index].value}
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
                  users.valueSeq().map((user, index) => (
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
                  participants.push( {
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
    const { handleSubmit, submitting, RewardTypeValue, RewardAmount, editable, budgetAmount } = this.props
    const value = this.calcEstimatedRewardAmount()
    const parsedExpression = this.parse(value)
    this.convertBasicFilters()
    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: 1030 }}>
        <Grid>

          <Row cols={6} className="slds-m-top--large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Dash name</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              <Field name="Name" component={this.nameInput}/>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={4}>
            </Col>
          </Row>

          <Row cols={6} className="slds-m-top--xx-large">
            <Col padded cols={6} className="slds-m-bottom--small">
              <h2 className={styles.fieldTitle}>Type</h2>
            </Col>
            <Col padded cols={6} colsSmall={3} colsMedium={2}>
              {this.typeSelect()}
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
              <Field name="MeasureEventType" component={this.basicFilterSelect} />
            </Col>
            {
              basicFilter == 'advanced' ?
              <Col padded cols={6} className="slds-m-top--large">
                <Field name="MeasureFilterCondition" component={this.advancedFilterSelect}/>
              </Col>
              :
              undefined
            }
            <Col padded cols={6} className="slds-m-top--large">
              <Field name="MeasureValue" component={this.measureValueInput}/>
            </Col>
          </Row>

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

          <Row cols={6} className="slds-m-top--xx-large" style={budgetAmount == 0 ? { display: 'none' } : {}}>
            <Col padded cols={6} className="slds-m-bottom--medium">
              <h2 className={styles.fieldTitle}>Rewards</h2>
            </Col>
            <Col padded cols={6} colsMedium={4}>
              {this.rewardTypeSelect()}
            </Col>
            <Col padded cols={6} colsMedium={2}>
              <table>
                <tbody>
                  <tr>
                    <td>Your Budget: </td><td><strong>${budgetAmount}</strong></td>
                  </tr><tr>
                    <td>This Dash: </td><td><strong>${value}</strong></td>
                  </tr><tr>
                    <td>Balance: </td><td><strong>${budgetAmount - value}</strong></td>
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
                <Link to='/dashes' style={{ marginRight: 10, display: 'inline-block' }}>
                  <Button type="neutral">Cancel</Button>
                </Link>
                <button type="submit" className="slds-button slds-button--brand" disabled={!editable || submitting}>Save Dash</button>
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
      RewardTypeValue: selector(state, 'RewardType'),
      RewardAmount: selector(state, 'RewardAmount'),
      rewards: selector(state, 'rewards'),
    }
  }
)(_DashForm)

export default _DashForm
