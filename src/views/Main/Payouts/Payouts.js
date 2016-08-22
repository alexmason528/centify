import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import { formatUrl } from 'utils/ApiClient'
import styles from './styles.module.css'


class Payouts extends Component {

  onDownload = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const url = formatUrl(`/v1/${profile.centifyOrgId}/dashes/payout`)
      window.open(url, '_blank')
    }
  }

  render() {
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <h2 className={styles.pageTitle}>Payouts</h2>
        <div className="slds-m-top--medium">
          <Button type="brand" onClick={this.onDownload}>Download payment CSV file</Button>
        </div>
      </div>
    )
  }
}

export default Payouts
