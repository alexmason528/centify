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
const emptyExpression = [{
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
    var matching // All or Any - starts undefined
    var state = 'init' // State machine starts in init
    var expressions = [] // Expressions to store
    var rootNode = math.parse(expression)
    rootNode.traverse(function (node, path, parent) {
      switch (node.type) {
        case 'OperatorNode':
          if(node.op == 'and') {
            assert(state == 'init', "Unexpected AND - No nested logic permitted")
            assert(!matching || (matching === 'all'), "Unexpected AND - Must be all ANDs or all ORs")
            matching = 'all'
          } else if(node.op == 'or') {
            assert(state == 'init', "Unexpected OR - No nested logic permitted")
            assert(!matching || (matching === 'any'), "Unexpected OR - Must be all ANDs or all ORs")
            matching = 'any'
          } else if(supportedOperators.includes(node.op)) {
            // Now a string of math ops
            state = 'expressions'

            if ('object' in node.args[0].object) {
              // We are dealing with nested array, so we need to validate
              var nested = node.args[0].object

              assert(nested.index.dimensions.length == 1, "Must be only 1 index into array")
              assert(nested.index.dimensions[0].start, "Invalid array notion")
              assert(nested.index.dimensions[0].end, "Invalid array notion")

              assert(nested.object.name, "Left hand side must be Data[]")

              assert(nested.object.index.dimensions.length == 1, "Must be only 1 index into array")
              assert(nested.object.index.dimensions[0].value == "Products", "Lack of Products subarray")
            } else {
              assert(node.args[0].object.name == 'Data', "Left hand side must be Data[]")
            }

            assert(node.args[0].index, "Left hand side must be an index into Data[]")
            assert(node.args[0].index.dimensions.length == 1, "Must be only 1 index into array")
            assert(node.args[0].index.dimensions[0].valueType == 'string', "Index into Data[] must be a string")

            switch(node.args[1].valueType) {
              case 'string':
                assert(supportedStringOperators.includes(node.op), "Unsupported operator for string")
                break
              case 'number':
                assert(supportedNumberOperators.includes(node.op), "Unsupported operator for number")
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
    let exp = ''
    const logicop = parsedExp.matching == 'all' ? 'and' : 'or'
    parsedExp.expressions.forEach((expitem, index) => {
      if (index > 0) {
        exp += ` ${logicop} `
      }
      exp += 'Data[\"' + expitem.fieldId + '\"] ' + expitem.operator
      if (!isNaN(expitem.value) && isFinite(expitem.value)) {
        exp += ' ' + expitem.value
      } else {
        exp += ' \"' + expitem.value + '\"'
      }
      
    })
    return exp
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
    // }
  }

  basicFilterSelect = (props, advancedEventTypeProps, advancedFilterProps, advancedFilterProps1) => {
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

  onAdvancedFilterOperatorChange = (op, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.matching = (op == 'all' ? 'and' : 'or')
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterAddItem = (index, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.expressions.splice(index + 1, 0, parsedExpression.expressions[index])
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterRemoveItem = (index, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.expressions.splice(index, 1)
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemFieldChange = (index, fieldId, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.expressions[index].fieldId = fieldId
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemOperatorChange = (index, opr, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.expressions[index].operator = opr
    onChange(this.compose(parsedExpression))
  }

  onAdvancedFilterItemValueChange = (index, expvalue, value, onChange) => {
    const parsedExpression = this.parse(value)
    parsedExpression.expressions[index].value = expvalue
    onChange(this.compose(parsedExpression))
  }

  parseSecondType = (value) => {
    // let parsedExp = {
    //   func: 'total',
    //   count: 5,
    //   field: '',
    //   operator: '==',
    //   value: 'something'
    // }
    let parsedExp = {
      func: 'total',
      count: 5,
      field: '06ry1nfhxnabawkv',
      operator: '==',
      value: 'something'
    }
    if (!value) {
      return parsedExp
    }
    // func
    if (value.substr(0, 5) == 'total') {
      parsedExp.func = 'total'
      value = value.substr(6)
    } else if (value.substr(0, 3) == 'any') {
      parsedExp.func = 'any'
      value = value.substr(4)
    }
    // field 
    const fieldStart = value.indexOf('"')
    if (fieldStart == -1) {
      throw("Invalid syntax - No field ID found")
    }
    value = value.substr(fieldStart + 1)
    const fieldEnd = value.indexOf('"')
    if (fieldEnd == -1) {
      throw('Invalid syntax - field ID is not enquoted')
    }
    parsedExp.field = value.substr(0, fieldEnd)
    value = value.substr(fieldEnd + 2).trim()
    // operator
    const oprEnd = value.indexOf(' ')
    parsedExp.operator = value.substr(0, oprEnd)
    value = value.substr(oprEnd + 1).trim()
    // value
    const valueStart = value.indexOf('"')
    if (valueStart == -1) {
      throw("Invalid syntax - No value ID found")
    }
    value = value.substr(valueStart + 1)
    const valueEnd = value.indexOf('"')
    if (valueEnd == -1) {
      throw('Invalid syntax - value ID is not enquoted')
    }
    parsedExp.value = value.substr(0, valueEnd)
    value = value.substr(valueEnd + 2).trim()
    // count - only if func == total
    if (parsedExp.func == 'total') {
      const oprPos = value.indexOf('>=')
      if (oprPos == -1) {
        throw('Invalid syntax - no criteria found for total()')
      }
      parsedExp.count = parseInt(value.substr(oprPos + 2).trim())
    }
    return parsedExp
  }

  composeSecondType = (value) => {
    let exp = ''
    exp += 'Data.Products[0:]["'
    exp += value.field
    exp += '"] '
    exp += value.operator
    exp += ' "'
    exp += value.value
    exp += '"'
    if (value.func == 'total') {
      exp = 'total(' + exp + ') >= ' + value.count
    } else {
      exp = 'any(' + exp + ')'
    }
    return exp
  }

  onAdvancedFilterSecondTypeValueChange = (newValues, props) => {
    const expValues = this.parseSecondType(props.input.value)
    for(const k in newValues) {
      expValues[k] = newValues[k]
    }
    props.input.onChange(this.composeSecondType(expValues))
  }

  advancedFilterSelect = (basicFilterProps, advancedFilterEventTypeProps, props, props1, filterConditionTypeProps) => {
    const parsedExpression = this.parse(props.input.value)
    const midTextSelectStyle = {
      display: 'inline-block',
      maxWidth: 100,
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
    const expressions = (
      parsedExpression.expressions.length > 0 ?
      parsedExpression.expressions
      :
      emptyExpression
    )
    const parsedExp2 = this.parseSecondType(props1.input.value)
    return (
      <div className="slds-m-top--medium">
        <div style={{ marginTop: 20, marginBottom: 10 }}>What type of record do you want to include?</div>
        <Select
          style={midTextSelectStyle}
          value={advancedFilterEventTypeProps.input.value}
          onChange={advancedFilterEventTypeProps.input.onChange}>
          {schemas.valueSeq().map((schema, index) => (
            <Option key={index} value={schema.get('Type')}>{schema.get('Type')}</Option>
          ))}
        </Select>
        {/*<Select style={midTextSelectStyle} value={parsedExpression.matching}
          onChange={e => this.onAdvancedFilterOperatorChange(e.currentTarget.value, props.input.value, props.input.onChange)}>
          <Option value="all">All</Option>
          <Option value="any">Any</Option>
        </Select>*/}
        <div className="slds-form-element" style={{ display: 'inline-block' }}>
          <div className="slds-form-element__control" style={{ display: 'inline-block' }}>
            <span className="slds-radio" style={allanyStyle}>
              <input type="radio" id="all" name="all" checked="" />
              <label className="slds-radio__label" htmlFor="all">
                <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                <span className="slds-form-element__label">Matching all</span>
              </label>
            </span>
            <span className="slds-radio" style={allanyStyle}>
              <input type="radio" id="any" name="any" />
              <label className="slds-radio__label" htmlFor="any">
                <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                <span className="slds-form-element__label">Matching any</span>
              </label>
            </span>
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
                      if (name.indexOf('.') == -1 && field.get('Type').toLowerCase() != 'datetime') {
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
                    <div>and</div>
                    <hr style={ruleLineStyle} />
                  </div>
                  :
                  ''
                }
              </div>
            )
          })}
        </div>
        <div clasName="slds-m-top--large">
          {/* Deal product filter */}
          <div style={{ marginTop: 20, marginBottom: 10 }}>What type of record do you want to include?</div>
            <Select
              style={midTextSelectStyle}
              value={advancedFilterEventTypeProps.input.value}
              onChange={advancedFilterEventTypeProps.input.onChange}>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
            <div className="slds-form-element" style={{ display: 'inline-block' }}>
              <div className="slds-form-element__control" style={{ display: 'inline-block' }}>
                <span className="slds-radio" style={allanyStyle}>
                  <input type="radio" id="all" name="all" checked="" />
                  <label className="slds-radio__label" htmlFor="all">
                    <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                    <span className="slds-form-element__label">Matching all</span>
                  </label>
                </span>
                <span className="slds-radio" style={allanyStyle}>
                  <input type="radio" id="any" name="any" />
                  <label className="slds-radio__label" htmlFor="any">
                    <span className="slds-radio--faux" style={allanyRadioStyle}></span>
                    <span className="slds-form-element__label">Matching any</span>
                  </label>
                </span>
              </div>
            </div>
        </div>
        {/*<div className="slds-form-element">
          <div className="slds-form-element__control">
            <label className="slds-radio">
              <input
                type="radio"
                checked={filterConditionTypeProps.input.value}
                onChange={e => filterConditionTypeProps.input.onChange(1)} />
              <span className="slds-radio--faux"></span>
              <span className="slds-form-element__label">
                Include <strong>deals</strong> with
                <Select
                  style={midTextSelectStyle}
                  value={parsedExp2.func}
                  onChange={e => this.onAdvancedFilterSecondTypeValueChange({ func: e.currentTarget.value }, props1)}
                  >
                  <Option value="total">at least</Option>
                  <Option value="any">any</Option>
                </Select>
                <Input
                  type="number"
                  style={midTextSelectStyle}
                  value={parsedExp2.count}
                  onChange={e => this.onAdvancedFilterSecondTypeValueChange({ count: e.currentTarget.value }, props1)} />
                products matching the following rule:
              </span>
            </label>
          </div>
        </div>
        <div style={{ paddingLeft: 35, maxWidth: 700 }}>
          <hr style={{ margin: '20px 0 10px' }} />
          <div style={ruleStyle}>
            <Select
              style={ruleSelectStyle}
              value={parsedExp2.field}
              onChange={e => this.onAdvancedFilterSecondTypeValueChange({ field: e.currentTarget.value }, props1)}
              >
              {
                schemas.get('Deal') ?
                schemas.getIn(['Deal', 'Fields']).valueSeq().map((field, index) => {
                  let name = field.get('Name')
                  if (name.substr(0, 9).toLowerCase() == 'products.') {
                    name = name.substr(9)
                    // if (name.substr(0, 7) == 'Product') {
                    //   name = name.replace('Product', 'Product ')
                    // } else {
                    //   name = 'Product ' + name
                    // }
                    return (
                      <Option key={index} value={field.get('Id')}>{name}</Option>
                    )
                  }
                })
                :
                undefined
              }
            </Select>
            <Select
              style={ruleSelectStyle}
              value={parsedExp2.operator}
              onChange={e => this.onAdvancedFilterSecondTypeValueChange({ operator: e.currentTarget.value }, props1)} >
              <Option value="==">is</Option>
              <Option value="!=">is not</Option>
              <Option value=">">is greater than</Option>
              <Option value="<">is less than</Option>
            </Select>
            <Input
              type="text"
              style={ruleSelectStyle}
              value={parsedExp2.value}
              onChange={e => this.onAdvancedFilterSecondTypeValueChange({ value: e.currentTarget.value }, props1)} />
          </div>
          <hr style={{ margin: '10px 0 20px' }} />
        </div>*/}
      </div>
    )
  }

  render() {
    const { MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition, MeasureFilterCondition1, MeasureFilterConditionType } = this.props
    return (
      <div>
        {this.basicFilterSelect(MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition, MeasureFilterCondition1)}
        {
          MeasureEventType.input.value == 'advanced' ?
          this.advancedFilterSelect(MeasureEventType, MeasureEventTypeAdvanced, MeasureFilterCondition, MeasureFilterCondition1, MeasureFilterConditionType)
          :
          ''
        }
      </div>
    )
  }

}

export default FilterConditionInput
