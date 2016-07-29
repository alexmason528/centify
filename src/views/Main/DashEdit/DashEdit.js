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

  render() {
    const { currentDash } = this.props
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <DashForm onSubmit={() => console.log('submit')}/>
      </div>
    )
  }

}

export default hoc(DashEdit);
