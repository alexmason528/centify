import React, { Component } from 'react'
import { 
  Input,
  Button,
  Select, Option
} from 'react-lightning-design-system'
import math from 'mathjs'

import hoc from './hoc'
import styles from './styles.module.css'
import { formatDate, format2Digits } from 'utils/formatter'


const supportedStringOperators = ['==','!=']
const supportedNumberOperators = ['==','!=','>','<']
const supportedOperators = ['==','!=','>','<']


class FilterConditionInput extends Component {

  static contextTypes = {
    notify: React.PropTypes.func,
    auth: React.PropTypes.object,
  }

  state = {
    basicFilter: '',
  }

  componentDidMount() {
    const auth = this.context.auth
    if (auth) {
      const profile = auth.getProfile()
      if (!profile.centifyOrgId) {
        this.context.notify('No organization ID available')
        return;
      }
      const {
        globalBasicFilters,
        loadingGlobal,
        loadedGlobal,
        orgBasicFilters,
        loadingOrg,
        loadedOrg,
        getGlobalBasicFilters,
        getOrgBasicFilters,
      } = this.props
      if (!loadedGlobal) {
        getGlobalBasicFilters()
        .catch(() => {
          this.context.notify('Failed to get Centify-wide basic filter schemas')
        })
      }
      if (!loadedOrg) {
        getOrgBasicFilters(profile.centifyOrgId)
        .catch(() => {
          this.context.notify('Failed to get Centify-wide basic filter schemas')
        })
      }
    }
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

  onChangeBasicFilterSelect = (e) => {
    this.setState({
      basicFilter: e.currentTarget.value,
    })
  }

  basicFilterSelect = (value) => {
    const basicSelectStyle = {
      maxWidth: 400,
      marginTop: 5,
    }
    return (
      <div>
        What is the metric?
        <div className="slds-form-element" style={basicSelectStyle}>
          <div className="slds-form-element__control">
            <div className="slds-select_container">
              <Select value={this.state.basicFilter} onChange={this.onChangeBasicFilterSelect}>
                <Option value="Deal">Deal</Option>
                <Option value="Call">Call</Option>
                <Option value="Email">Email</Option>
                <Option value="Lead">Lead</Option>
                <Option value="advanced">Advanced...</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  advancedFilterSelect = (parsedExpression) => {
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
                  <Option value="deals">Deals</Option>
                  <Option value="calls">Calls</Option>
                  <Option value="values">Values</Option>
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
                  <Option value="salesvalue">Sales Value</Option>
                  <Option value="value">Value</Option>
                  <Option value="deals">Deals</Option>
                </Select>
                <Select style={ruleSelectStyle} value={expression.operator}>
                  <Option value="==">is</Option>
                  <Option value="!=">is not</Option>
                  <Option value=">">is greater than</Option>
                  <Option value="<">is less than</Option>
                </Select>
                <Select style={ruleSelectStyle} value={expression.value}>
                  <Option value="closed">Closed Won</Option>
                  <Option value="things">Things</Option>
                  <Option value="more">More</Option>
                </Select>
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

  render() {
    const {
      globalBasicFilters,
      loadingGlobal,
      loadedGlobal,
      orgBasicFilters,
      loadingOrg,
      loadedOrg,
      getGlobalBasicFilters,
      getOrgBasicFilters,
    } = this.props
    if (!loadedGlobal || !loadedOrg) {
      return (
        <div style={{ border: '1px solid #f0f0f1', padding: '10px 25px' }}>
          Loading data...
        </div>
      )
    }
    const { basicFilter } = this.state
    const { value } = this.props
    const parsedExpression = this.parse(value)
    return (
      <div>
        {this.basicFilterSelect(value)}
        {
          basicFilter == 'advanced' ?
          this.advancedFilterSelect(parsedExpression)
          :
          undefined
        }
      </div>
    )
  }

}

export default hoc(FilterConditionInput)
