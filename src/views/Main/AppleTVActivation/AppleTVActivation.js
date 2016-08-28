import React, { Component } from 'react'
import { Input, Button } from 'react-lightning-design-system'
import { Icon } from 'react-fa'

import MessageDialog from 'components/MessageDialog/MessageDialog'
import hoc from './hoc'
import styles from './styles.module.css'

class AppleTVActivation extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  state = {
    dialogOpen: false,
    dialogText: '',
    tvCode: '',
    submitting: false,
  }

  activate = () => {
    const auth = this.props.auth
    if (auth) {
      const profile = auth.getProfile()
      const { tvCode } = this.state
      if (!/^[0-9]{4}$/g.test(tvCode)) {
        this.openDialog('Please enter four digit into input field.')
        return
      }
      this.setState({
        submitting: true
      })
      this.props.activateAppleTV(profile.centifyOrgId, tvCode)
      .then(res => {
        this.openDialog('Successfully activated Apple TV')
      })
      .catch(() => {
        this.openDialog('Failed to activate Apple TV')
      })
    }
  }

  onTVCodeInputChange = (e) => {
    this.setState({
      tvCode: e.currentTarget.value,
    })
  }

  openDialog = (text) => {
    this.setState({
      dialogOpen: true,
      dialogText: text
    })
  }

  closeDialog = () => {
    this.setState({
      dialogOpen: false,
      submitting: false,
    })
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
    const { dialogOpen, dialogText, tvCode, submitting } = this.state
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
                  <p>Enter Apple TV Activation code here</p>
                </div>
              </div>
            </span>
          </div>
          <Input
            type="text"
            value={tvCode}
            onChange={this.onTVCodeInputChange}
            style={{ maxWidth: 350 }} />
          <div className="slds-text-align--right slds-m-top--medium">
            <Button type="brand" onClick={this.activate} disabled={submitting}>Activate</Button>
          </div>
        </div>
        <MessageDialog
          open={dialogOpen}
          text={dialogText}
          onClose={this.closeDialog} />
      </div>
    )
  }
}

export default hoc(AppleTVActivation)
