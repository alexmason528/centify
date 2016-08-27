import React, { Component } from 'react'
import { Input, Button } from 'react-lightning-design-system'
import { Icon } from 'react-fa'

import hoc from './hoc'
import styles from './styles.module.css'

class AppleTVActivation extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  activate = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      this.props.activateAppleTV(profile.centifyOrgId)
      .then(res => {
        this.context.notify('Successfully activated Apple TV', 'success')
      })
      .catch(() => {
        this.context.notify('Failed to activate Apple TV', 'error')
      })
    }
  }

  render() {
    const titleStyle = {
      fontSize: 28,
      fontWeight: 700,
    }
    const labelStyle = {
      fontSize: 18,
      fontWeight: 700,
      textTransform: 'uppercase',
    }
    const helpIconStyle = {
      fontSize: '1.3em',
      verticalAlign: 0,
      color: '#7cc74c',
      marginLeft: 10,
    }
    return (
      <div className="slds-m-horizontal--medium slds-m-vertical--large" style={{ maxWidth: 830 }}>
        <h2 style={titleStyle}>Apple TV Activation</h2>
        <div className="slds-m-top--xx-large">
          <div className="slds-m-bottom--small" style={labelStyle}>
            Apple TV Code
            <span className={styles.helpIconWrapper}>
              <a href="javascript:void(0)">
                <Icon name="question-circle" style={helpIconStyle} />
              </a>
              <div className={'slds-popover slds-nubbin--left ' + styles.helpPopover} role="dialog">
                <div className="slds-popover__body">
                  <p>Description</p>
                </div>
              </div>
            </span>
          </div>
          <Input
            type="text"
            style={{ maxWidth: 350 }} />
          <div className="slds-text-align--right slds-m-top--medium">
            <Button type="brand" onClick={this.activate}>Activate</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default hoc(AppleTVActivation)
