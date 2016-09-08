import React, { Component } from 'react'
import { Button } from 'react-lightning-design-system'

import ApiClient, { formatUrl } from 'utils/ApiClient'
import styles from './styles.module.css'


class Payouts extends Component {

  constructor(props) {
    super(props)

    this.client = new ApiClient()
  }

  onDownload = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const url = formatUrl(`/v1/${profile.centifyOrgId}/dashes/payout`)
      this.client.get(url).then((res) => {
        window.location.href = res.url
      })
    }
  }

  render() {
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--medium">
        <h2 className={styles.pageTitle}>Payouts</h2>
        <div className="slds-m-top--medium">
          <a ref="tempAnchor" id="payout-anchor" href="#" style={{ display: 'none' }} />
          <Button type="brand" onClick={this.onDownload}>Download payment CSV file</Button>
        </div>
      </div>
    )
  }
}

export default Payouts
