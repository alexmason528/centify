import React from 'react'

const LoadingSpinner = ({ width, height }) => {
  const bgStyle = {
    backgroundColor: '#fff'
  }
  const containerStyle = {
    position: 'relative',
    height: height ? height : 500,
    width: width ? width + '%' : '90%',
  }
  return (
    <div style={bgStyle}>
      <div className="slds-spinner_container" style={containerStyle}>
        <div className="slds-spinner slds-spinner--large" aria-hidden="false" role="alert">
          <div className="slds-spinner__dot-a"></div>
          <div className="slds-spinner__dot-b"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
