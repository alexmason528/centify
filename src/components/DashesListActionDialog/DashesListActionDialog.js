import React, { Component } from 'react'

class DashesListActionDialog extends Component {

  confirmText = (action, dashName) => {
    if (action == 'approve') {
      return (
        <p>
          Are you sure you want to approve the dash, no further changes will be allowed and payouts will be approved.
        </p>
      );
    } else {
      return (
        <p>
          Are you sure you want to {action} the dash: {dashName}?
        </p>
      );
    }
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
