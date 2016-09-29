import React, { Component } from 'react'
import { 
  Input,
  Button,
  Select, Option,
  Radio,
} from 'react-lightning-design-system'
import math from 'mathjs'

import styles from './styles.module.css'
import { formatDate, format2Digits } from 'utils/formatter'
import basicFilters from 'basic-filters.json'

const supportedStringOperators = ['==', '!=', '>', '<']
const supportedNumberOperators = ['==', '!=', '>', '<']
const supportedOperators = ['==', '!=', '>', '<']
const supportedBooleans = ['true', 'false']

const emptyExpression = [{
  fieldId: '0',
  operator: '==',
  value: 'something',
}]
const emptyExpression2 = [{
  fieldId: '0',
  operator: '==',
  value: 'something',
}]

class FilterConditionInput extends Component {

  static contextTypes = {
    notify: React.PropTypes.func,
    auth: React.PropTypes.object,
  }

  state = {
    basicFilter: '',
  }

  constructor(props) {
    super(props)

    this.convertedBasicFilters = false
  }

  componentWillMount() {
    this.convertBasicFilters()
    const { MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition } = this.props
    if (MeasureFilterCondition.input.value) {
      for(const k in this.convertedBasicFilters) {
        const filter = this.convertedBasicFilters[k]
        if (filter.EventType == MeasureEventType.input.value && filter.FilterConditionPattern != MeasureFilterCondition.input.value) {
          MeasureEventType.input.onChange('advanced')
        }
      }
    }
  }


  /* Parser engine */

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
    let firstPart = null
    let secondPart = null
    const regexp = /\((.*)\)\sand\sany\((.*)\)/g;
    expression.replace(regexp, function(exp, param1, param2) {
      firstPart = param1
      secondPart = param2
      return exp
    })
    if (!firstPart) {
      firstPart = expression
    }
    return {
      firstPart: this.parseExpression(firstPart),
      secondPart: secondPart ? this.parseExpression(secondPart) : null,
    }
  }

  parseExpression = (expression) => {
    var matching // All or Any - starts undefined
    var state = 'init' // State machine starts in init
    var expressions = [] // Expressions to store
    var rootNode = math.parse(expression)
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
            var valueType = node.args[1].valueType
            var value = node.args[1].value

            if ('name' in node.args[1]) { // Most probably a boolean
              valueType = 'boolean'
              value = node.args[1].name === 'true'
            }

            if ('object' in node.args[0].object) {
              // We are dealing with nested array, so we need to validate
              var nested = node.args[0].object

              this.assert(nested.index.dimensions.length == 1, "Must be only 1 index into array")
              this.assert(nested.index.dimensions[0].start, "Invalid array notion")
              this.assert(nested.index.dimensions[0].end, "Invalid array notion")

              this.assert(nested.object.name, "Left hand side must be Data[]")

              this.assert(nested.object.index.dimensions.length == 1, "Must be only 1 index into array")
              this.assert(nested.object.index.dimensions[0].value == "Products", "Lack of Products subarray")
            } else {
              this.assert(node.args[0].object.name == 'Data', "Left hand side must be Data[]")
            }

            this.assert(node.args[0].index, "Left hand side must be an index into Data[]")
            this.assert(node.args[0].index.dimensions.length == 1, "Must be only 1 index into array")
            this.assert(node.args[0].index.dimensions[0].valueType == 'string', "Index into Data[] must be a string")

            switch(valueType) {
              case 'string':
                this.assert(supportedStringOperators.includes(node.op), "Unsupported operator for string")
                break
              case 'number':
                this.assert(supportedNumberOperators.includes(node.op), "Unsupported operator for number")
                break
              case 'boolean':
                this.assert(supportedBooleans.includes(node.args[1].name), 'Unsupported value for boolean')
                break
              default:
                throw("Unsupported value - only strings, numbers and boolean values are supported")
            }
            expressions.push({
              'fieldId': node.args[0].index.dimensions[0].value,
              'operator': node.op,
              'value': value
            })
          } else {
            throw("Unsupported operator " + node.op)
          }
          break
        case 'ConstantNode':; break
        case 'SymbolNode':; break
        case 'IndexNode':; break
        case 'AccessorNode':; break
        case 'RangeNode':; break
        default:
          throw("Unexpected element " + node.type)
      }
    })
    return {
      'matching': matching,
      'expressions': expressions
    }
  }

  compose = (parsedExp) => {
    if (!parsedExp.firstPart.expressions || !parsedExp.firstPart.expressions.length) {
      parsedExp.firstPart.expressions = emptyExpression
    }
    let exp = this.composeExpression(parsedExp.firstPart)
    if (parsedExp.secondPart) {
      if (!parsedExp.secondPart.expressions || !parsedExp.secondPart.expressions.length) {
        parsedExp.secondPart.expressions = emptyExpression2
      }
      let exp2 = this.composeExpression(parsedExp.secondPart, 'Data["Products"][0:]')
      exp = `(${exp}) and any(${exp2})`
    }
    return exp
  }

  composeExpression = (parsedExp, lefthand = 'Data') => {
    let exp = ''
    const logicop = parsedExp.matching == 'all' ? 'and' : 'or'
    const { schemas, MeasureEventTypeAdvanced } = this.props
    const fields = schemas.getIn([MeasureEventTypeAdvanced.input.value, 'Fields'])
    parsedExp.expressions.forEach((expitem, index) => {
      if (index > 0) {
        exp += ` ${logicop} `
      }
      const fieldType = fields.getIn([expitem.fieldId, 'Type'])
      exp += lefthand + '[\"' + expitem.fieldId + '\"] ' + expitem.operator
      if (!isNaN(expitem.value) && isFinite(expitem.value) && fieldType == 'Number') {
        exp += ' ' + expitem.value
      } else if(fieldType == 'Boolean') {
        exp += ' ' + (expitem.value.toString().toLowerCase() == "true")
      } else {
        exp += ' \"' + expitem.value + '\"'
      }
      
    })
    return exp
  }


  /* Validate current filter condition expression */

  validateExpression = (fields, parsedExp) => {
    const firstFieldId = fields.keySeq().first()
    const firstFieldType = fields.getIn([firstFieldType, 'Type'])
    parsedExp.expressions.map(exp => {
      const fieldId = fields.getIn([exp.fieldId, 'Id'])
      if (!fieldId) {
        exp.fieldId = firstFieldId
        if (firstFieldType == "Number") {
          exp.value = 0
        } else if (firstFieldType == "Boolean") {
          exp.value = false
        } else {
          exp.value = "Something"
        }
      }
    })
    return parsedExp
  }

  validateFilterCondition = () => {
    const { MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition } = this.props
    if (MeasureEventType.input.value != 'advanced') {     // Basic filter validate
      for(const k in this.convertedBasicFilters) {
        const filter = this.convertedBasicFilters[k]
        if (filter.EventType == MeasureEventType.input.value && filter.FilterConditionPattern != MeasureFilterCondition.input.value) {
          MeasureFilterCondition.input.onChange(filter.FilterConditionPattern)
          break
        }
      }
    } else {    // Advanced filter validate
      const parsedExpression = this.parse(MeasureFilterCondition.input.value)
      const { schemas, MeasureEventTypeAdvanced } = this.props
      const fields = schemas.getIn([MeasureEventTypeAdvanced.input.value, 'Fields'])
      parsedExpression.firstPart = this.validateExpression(
        fields.filter(field => {
          const name = field.get('Name')
          return (name.indexOf('.') == -1 && field.get('Type').toLowerCase() != 'Datetime')
        }),
        parsedExpression.firstPart
      )
      parsedExpression.secondPart = 
        MeasureEventTypeAdvanced.input.value == 'Deal' && !!parsedExpression.secondPart ?
        this.validateExpression(
          fields.filter(field => {
            const name = field.get('Name')
            return (name.substr(0, 9).toLowerCase() == 'products.' && field.get('Type') != 'Datetime')
          }),
          parsedExpression.secondPart)
        :
        null
      MeasureFilterCondition.input.onChange(this.compose(parsedExpression))
    }
  }


  /* Basic filter select */

  convertBasicFilters() {
    if (this.convertedBasicFilters) {
      return
    }
    const {
      schemas,
    } = this.props
    for(const k in basicFilters) {
      const filter = basicFilters[k]
      filter.FilterConditionPattern = filter.FilterConditionPattern.replace(/Data\[\"([A-Za-z]+)\"\]/g, (v, name) => {
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

  onChangeBasicFilterSelect = (e, onChange, advancedEventTypeProps, advancedFilterProps) => {
    onChange(e.currentTarget.value)
    // if (!advancedEventTypeProps.input.value) {
    const defaultAdvEventType = e.currentTarget.value == 'advanced' ? 'Deal' : e.currentTarget.value
    advancedEventTypeProps.input.onChange(defaultAdvEventType)
    for(const k in this.convertedBasicFilters) {
      const filter = this.convertedBasicFilters[k]
      if (filter.EventType == defaultAdvEventType) {
        advancedFilterProps.input.onChange(filter.FilterConditionPattern)
        break
      }
    }
    // setTimeout(() => {
    //   this.validateFilterCondition()
    // }, 10)
    // }
  }

  basicFilterSelect = (props, advancedEventTypeProps, advancedFilterProps) => {
    const basicSelectStyle = {
      maxWidth: 400,
      marginTop: 5,
    }
    const basicFilterOptions = []
    for(const k in this.convertedBasicFilters) {
      const filter = this.convertedBasicFilters[k]
      basicFilterOptions.push(
        <Option key={k} value={filter.EventType}>{filter.Name}</Option>
      )
    }
    return (
      <div>
        What do you want to include in SPIFF?
        <div className="slds-form-element" style={basicSelectStyle}>
          <div className="slds-form-element__control">
            <div className="slds-select_container">
              <Select
                value={props.input.value}
                onChange={e => this.onChangeBasicFilterSelect(
                  e,
                  props.input.onChange,
                  advancedEventTypeProps,
                  advancedFilterProps )}
                >
                <Option value="">- Select filter -</Option>
                {basicFilterOptions}
                <Option value="advanced">Advanced...</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }


  /* Advanced filter select */

  onAdvancedFilterOperatorChange = (op, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    if (parsedExpression[fsIndex]) {
      parsedExpression[fsIndex].matching = (op == 'all' ? 'all' : 'any')
    }
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterAddItem = (index, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    parsedExpression[fsIndex].expressions.splice(index + 1, 0, parsedExpression[fsIndex].expressions[index])
    if (!parsedExpression[fsIndex].matching) {
      parsedExpression[fsIndex].matching = 'all'
    }
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterRemoveItem = (index, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    parsedExpression[fsIndex].expressions.splice(index, 1)
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemFieldChange = (index, fieldId, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    parsedExpression[fsIndex].expressions[index].fieldId = fieldId
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemOperatorChange = (index, opr, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    parsedExpression[fsIndex].expressions[index].operator = opr
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemValueChange = (index, expvalue, value, onChange, fsIndex = 'firstPart') => {
    const parsedExpression = this.parse(value)
    const { schemas, MeasureEventTypeAdvanced } = this.props
    const fields = schemas.getIn([MeasureEventTypeAdvanced.input.value, 'Fields'])
    const fieldType = fields.getIn([parsedExpression[fsIndex].expressions[index].fieldId, 'Type'])
    let newvalue = expvalue
    if (!newvalue) {
      if (fieldType == "Number") {
        newvalue = 0
      } else if (fieldType == "Boolean") {
        newvalue = false
      } else {
        newvalue = ""
      }
    } else {
      if (fieldType == "Boolean") {
        newvalue = (expvalue != "false" && !!expvalue)
      }
    }
    parsedExpression[fsIndex].expressions[index].value = newvalue
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterToggleSecondPart = (value, propsValue, onChange) => {
    let parsedExpression = this.parse(propsValue)
    parsedExpression.secondPart = (value == 'yes' ? parsedExpression.secondPart : null)
    if (!parsedExpression.secondPart && value == 'yes') {
      parsedExpression.secondPart = {
        matching: 'all',
        expressions: emptyExpression2,
      }
    }
    onChange(this.compose(parsedExpression))
  }

  advancedFilterSelect = (basicFilterProps, advancedFilterEventTypeProps, props) => {
    const parsedExpression = this.parse(props.input.value)
    const { firstPart, secondPart } = parsedExpression
    const midTextSelectStyle = {
      display: 'inline-block',
      maxWidth: 160,
    }
    const ruleSelectStyle = {
      display: 'inline-block',
      maxWidth: 160,
      marginRight: 15,
    }
    const ruleStyle = {
      paddingTop: 20,
    }
    const ruleButtonStyle = {
      width: 30,
      marginLeft: 5,
      padding: 0,
      textAlign: 'center',
    }
    const allanyStyle = {
      display: 'inline-block',
      marginLeft: 25,
    }
    const allanyRadioStyle = {
      marginRight: 15,
    }
    const ruleSepStyle = {
      marginTop: 15,
      position: 'relative',
    }
    const ruleLineStyle = {
      margin: 0,
      position: 'absolute',
      left: 30,
      top: 10,
      right: 0,
    }
    const {
      schemas
    } = this.props
    const expressions = firstPart.expressions
    const expressions2 = secondPart ? secondPart.expressions : null
    return (
      <div className="slds-m-top--x-large">
        <div style={{ marginBottom: 10 }}>What type of record do you want to include?</div>
        <Select
          style={midTextSelectStyle}
          value={advancedFilterEventTypeProps.input.value}
          onChange={e => {
            advancedFilterEventTypeProps.input.onChange(e)
            this.onAdvancedFilterToggleSecondPart(false, props.input.value, props.input.onChange)
            setTimeout(() => {
              this.validateFilterCondition()
            }, 10)
          }}>
          {schemas.valueSeq().map((schema, index) => (
            <Option key={index} value={schema.get('Type')}>{schema.get('Type')}</Option>
          ))}
        </Select>
        <div className="slds-form-element" style={{ display: 'inline-block' }}>
          <div className="slds-form-element__control" style={{ display: 'inline-block' }}>
            <label className="slds-radio" style={allanyStyle}>
              <input type="radio" id="all" name="all"
                checked={firstPart.matching != 'any'}
                onChange={e => {
                  if (e.currentTarget.value == 'on') {
                    this.onAdvancedFilterOperatorChange('all', props.input.value, props.input.onChange)
                  }
                }} />
              <span className="slds-radio--faux" style={allanyRadioStyle}></span>
              <span className="slds-form-element__label">Matching all</span>
            </label>
            <label className="slds-radio" style={allanyStyle}>
              <input type="radio" id="any" name="any"
                checked={firstPart.matching == 'any'}
                onChange={e => {
                  if (e.currentTarget.value == 'on') {
                    this.onAdvancedFilterOperatorChange('any', props.input.value, props.input.onChange)
                  }
                }} />
              <span className="slds-radio--faux" style={allanyRadioStyle}></span>
              <span className="slds-form-element__label">Matching any</span>
            </label>
          </div>
        </div>
        <div style={{ maxWidth: 700 }}>
          {expressions.map((expression, index) => {
            return (
              <div style={ruleStyle} key={index}>
                <Select style={ruleSelectStyle} value={expression.fieldId}
                  onChange={e => this.onAdvancedFilterItemFieldChange(index, e.currentTarget.value, props.input.value, props.input.onChange)}>
                  {
                    schemas.get(advancedFilterEventTypeProps.input.value) ?
                    schemas.getIn([advancedFilterEventTypeProps.input.value, 'Fields']).valueSeq().map((field, index) => {
                      const name = field.get('Name')
                      if (name.indexOf('.') == -1 && field.get('Type').toLowerCase() != 'Datetime') {
                        return (
                          <Option key={index} value={field.get('Id')}>{name}</Option>
                        )
                      }
                    })
                    :
                    undefined
                  }
                </Select>
                <Select style={ruleSelectStyle} value={expression.operator}
                  onChange={e => this.onAdvancedFilterItemOperatorChange(index, e.currentTarget.value, props.input.value, props.input.onChange)}>
                  <Option value="==">is</Option>
                  <Option value="!=">is not</Option>
                  <Option value=">">is greater than</Option>
                  <Option value="<">is less than</Option>
                </Select>
                <Input type="text" style={ruleSelectStyle} value={expression.value}
                  onChange={e => this.onAdvancedFilterItemValueChange(index, e.currentTarget.value, props.input.value, props.input.onChange)} />
                <div className="slds-float--right">
                  <Button type="icon-border" icon="add"
                    onClick={() => {
                      this.onAdvancedFilterAddItem(index, props.input.value, props.input.onChange)
                    }} />
                  {
                    expressions.length > 1 ?
                    <Button type="icon-border" icon="dash"
                      onClick={() => {
                        this.onAdvancedFilterRemoveItem(index, props.input.value, props.input.onChange)
                      }} />
                    :
                    ''
                  }
                </div>
                {
                  index < expressions.length - 1 ?
                  <div style={ruleSepStyle}>
                    <div>{firstPart.matching != 'any' ? 'and' : 'or'}</div>
                    <hr style={ruleLineStyle} />
                  </div>
                  :
                  ''
                }
              </div>
            )
          })}
        </div>
        <div
          className="slds-m-top--xx-large"
          style={advancedFilterEventTypeProps.input.value == 'Deal' ? {} : { display: 'none' }}
          >
          <div style={{ marginBottom: 10 }}>Do you want to require products associated on the deal?</div>
          <Select
            style={midTextSelectStyle}
            value={parsedExpression.secondPart ? 'yes' : 'no'}
            onChange={e => {
              this.onAdvancedFilterToggleSecondPart(e.currentTarget.value, props.input.value, props.input.onChange)
              setTimeout(() => {
                this.validateFilterCondition()
              }, 10)
            }}
            >
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
          <div className="slds-form-element" style={{ display: 'inline-block' }}>
            <div className="slds-form-element__control" style={{ display: 'inline-block' }}>
              <label className="slds-radio" style={allanyStyle}>
                <input type="radio" id="all2" name="all2"
                  checked={!!secondPart && secondPart.matching != 'any'}
                  onChange={e => {
                    if (e.currentTarget.value == 'on') {
                      this.onAdvancedFilterOperatorChange('all', props.input.value, props.input.onChange, 'secondPart')
                    }
                  }} />
                <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                <span className="slds-form-element__label">Matching all</span>
              </label>
              <label className="slds-radio" style={allanyStyle}>
                <input type="radio" id="any2" name="any2"
                  checked={!!secondPart && secondPart.matching == 'any'}
                  onChange={e => {
                    if (e.currentTarget.value == 'on') {
                      this.onAdvancedFilterOperatorChange('any', props.input.value, props.input.onChange, 'secondPart')
                    }
                  }} />
                <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                <span className="slds-form-element__label">Matching any</span>
              </label>
            </div>
          </div>
          {
            secondPart ?
            <div style={{ maxWidth: 700 }}>
              {expressions2.map((expression, index) => {
                return (
                  <div style={ruleStyle} key={index}>
                    <Select style={ruleSelectStyle} value={expression.fieldId}
                      onChange={e => this.onAdvancedFilterItemFieldChange(index, e.currentTarget.value, props.input.value, props.input.onChange, 'secondPart')}>
                      {
                        schemas.get('Deal') ?
                        schemas.getIn(['Deal', 'Fields']).valueSeq().map((field, index) => {
                          let name = field.get('Name')
                          if (name.substr(0, 9).toLowerCase() == 'products.' && field.get('Type') != 'Datetime') {
                            name = name.substr(9)
                            return (
                              <Option key={index} value={field.get('Id')}>{name}</Option>
                            )
                          }
                        })
                        :
                        undefined
                      }
                    </Select>
                    <Select style={ruleSelectStyle} value={expression.operator}
                      onChange={e => this.onAdvancedFilterItemOperatorChange(index, e.currentTarget.value, props.input.value, props.input.onChange, 'secondPart')}>
                      <Option value="==">is</Option>
                      <Option value="!=">is not</Option>
                      <Option value=">">is greater than</Option>
                      <Option value="<">is less than</Option>
                    </Select>
                    <Input type="text" style={ruleSelectStyle} value={expression.value}
                      onChange={e => this.onAdvancedFilterItemValueChange(index, e.currentTarget.value, props.input.value, props.input.onChange, 'secondPart')} />
                    <div className="slds-float--right">
                      <Button type="icon-border" icon="add"
                        onClick={() => {
                          this.onAdvancedFilterAddItem(index, props.input.value, props.input.onChange, 'secondPart')
                        }} />
                      {
                        expressions2.length > 1 ?
                        <Button type="icon-border" icon="dash"
                          onClick={() => {
                            this.onAdvancedFilterRemoveItem(index, props.input.value, props.input.onChange, 'secondPart')
                          }} />
                        :
                        ''
                      }
                    </div>
                    {
                      index < expressions2.length - 1 ?
                      <div style={ruleSepStyle}>
                        <div>{secondPart.matching != 'any' ? 'and' : 'or'}</div>
                        <hr style={ruleLineStyle} />
                      </div>
                      :
                      ''
                    }
                  </div>
                )
              })}
            </div>
            :
            ''
          }
        </div>
      </div>
    )
  }

  render() {
    const { MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition } = this.props
    return (
      <div>
        {this.basicFilterSelect(MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition)}
        {
          MeasureEventType.input.value == 'advanced' ?
          this.advancedFilterSelect(MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition )
          :
          ''
        }
      </div>
    )
  }

}

export default FilterConditionInput
