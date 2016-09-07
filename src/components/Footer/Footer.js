import React from 'react'

const Footer = ({ style }) => {
  return (
    <div className="slds-page-header" role="banner" style={{ borderTop: '1px solid #d8dde6', ...style }}>
      {"MyCentify " + __NPM_PACKAGE_VERSION__}
    </div>
  )
}

export default Footer
