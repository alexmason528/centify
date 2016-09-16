import React, { Component } from 'react'

class DashesListActionDialog extends Component {

  confirmText = (action, dashName) => {

    let actionText = `Are you sure you want to ${action} the SPIFF`
    if (dashName == undefined)
      actionText = `Are you sure you want to ${action} the SPIFF?`
    else
      actionText = `Are you sure you want to ${action} the SPIFF: ${dashName}?`

    if (action == 'approve') {
      actionText = 'Are you sure you want to approve the SPIFF, no further changes will be allowed and payouts will be approved.'
    } else if (action == 'resend invitations') {
      actionText = 'Are you sure you want to resend invitations to all participants that haven\'t joined?'
    }
    return (
      <p>
        {actionText}
      </p>
    );
  }

  render() {
    const { open, submitting, action, dashName, onClose, onYes } = this.props
    return (
      <div>
        <div role="dialog" tabIndex="-1" aria-labelledby="header43" className={'slds-modal' + (open ? ' slds-fade-in-open' : '')}>
          <div className="slds-modal__container">
            <div className="slds-modal__content slds-p-around--medium">
              <div>
                {this.confirmText(action, dashName)}
              </div>
            </div>
            <div className="slds-modal__footer">
              <button className="slds-button slds-button--neutral" disabled={submitting} onClick={onClose}>No</button>
              <button className="slds-button slds-button--neutral slds-button--brand" disabled={submitting} onClick={onYes}>Yes</button>
            </div>
          </div>
        </div>
        <div className={'slds-backdrop' + (open ? ' slds-backdrop--open' : '')}></div>
      </div>
    )
  }

}

export default DashesListActionDialog
