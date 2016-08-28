import React, { Component } from 'react'

class MessageDialog extends Component {
  render() {
    const { open, title, text, onClose } = this.props
    return (
      <div>
        <div role="dialog" tabIndex="-1" aria-labelledby="header43" className={'slds-modal' + (open ? ' slds-fade-in-open' : '')}>
          <div className="slds-modal__container">
            {
              title ?
              <div className="slds-modal__header">
                <h2 className="slds-text-heading--medium">{title}</h2>
              </div>
              :
              ''
            }
            <div className="slds-modal__content slds-p-around--medium">
              <div>
                <p>{text}</p>
              </div>
            </div>
            <div className="slds-modal__footer">
              <button className="slds-button slds-button--neutral" onClick={onClose}>OK</button>
            </div>
          </div>
        </div>
        <div className={'slds-backdrop' + (open ? ' slds-backdrop--open' : '')}></div>
      </div>
    )
  }
}

export default MessageDialog
