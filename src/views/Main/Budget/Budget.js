import React, { PropTypes as T } from 'react'
import { Input, Button } from 'react-lightning-design-system'

import AuthService from 'utils/AuthService'
import hoc from './hoc'
import styles from './styles.module.css'

export class Budget extends React.Component {
  static contextTypes = {
    router: T.object
  }

  state = {
    budget: ''
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  componentDidMount() {
    const profile = this.props.auth.getProfile()
    var that = this
    this.props.getBudget(profile.centifyOrgId)
    .then((response) => {
      console.log('budget response: ', response)
      that.setState({
        budget: response.BudgetAmount
      })
    })
    // this.setState({
    //   budget: this.props.budgetAmount,
    // })
  }

  onBudgetChange = (e) => {
    this.setState({
      budget: e.currentTarget.value,
    })
  }

  setBudget = () => {
    const profile = this.props.auth.getProfile()
    this.props.setBudget(profile.centifyOrgId, this.state.budget)
  }

  render() {
    const titleStyle = {
      fontWeight: 700,
      fontSize: 22,
      marginTop: 20,
      marginBottom: 30,
    }
    const labelStyle = {
      fontSize: 18,
      fontWeight: 700
    }
    const { auth } = this.props
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--large" style={{ maxWidth: 830 }}>
        <h2 style={titleStyle}>Budget</h2>
        <div className="slds-m-top--xx-large">
          <span className="slds-m-right--small" style={labelStyle}>
            Budget
          </span>
          <Input
            type="text"
            value={this.state.budget}
            onChange={this.onBudgetChange}
            style={{ maxWidth: 350 }} />
          <span className="slds-m-left--large">
            <Button type="brand" onClick={this.setBudget}>Set Budget</Button>
          </span>
        </div>
      </div>
    )
  }
}

export default hoc(Budget)
