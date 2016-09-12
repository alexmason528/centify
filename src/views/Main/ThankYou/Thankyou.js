import React, { Component } from 'react'
import { 
  Checkbox,
  Button,
} from 'react-lightning-design-system'
import { Link } from 'react-router'
import { Icon } from 'react-fa'
import salesforceImage from 'images/Salesforce.png'
import appstoreImage from 'images/AppStore-download.png'
import googleplayImage from 'images/GooglePlay-download.png'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import styles from './styles.module.css'
import hoc from './hoc'

class ThankYou extends Component {

  static contextTypes = {
    notify: React.PropTypes.func
  }

  componentDidMount() {
    const auth = this.props.auth
    if (auth) {
    }
  }

  render() {
    const { loadedTodos, loadingTodos, auth } = this.props
    const profile = auth.getProfile()
    if (loadingTodos) {
      return (
        <LoadingSpinner/>
      )
    }
    const tdStyle = {
      paddingLeft: 20,
      paddingRight: 15,
      position: 'relative',
    }
    const tooltipStyle = {
      position: 'absolute',
      left: '50%',
      bottom: '100%',
      transform: 'translate3d(-50%, -5px, 0)',
      whiteSpace: 'normal',
      visibility: 'hidden',
    }
    const activeIconStyle = {
      color: '#7cc94c',
      fontSize: 16,
    }
    const inactiveIconStyle = {
      color: '#ef572f',
      fontSize: 16,
    }
    return (
      <div className={styles.root + ' slds-m-horizontal--medium slds-m-vertical--medium'}>
        <div className="slds-m-vertical--x-large">
          <h2 className="slds-m-bottom--small" style={{ fontSize: 28, fontWeight: 700 }}>Thank you - Signup Completed</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi luctus tortor
        </div>
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-m-bottom--small slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>
            1. Link Salesforce.com to Centify
          </h3>
          <div className="slds-m-bottom--large">Follow the app instructions on setting up</div>
          <div className="slds-align--absolute-center slds-container--medium slds-m-bottom--large">
            <div className="slds-image">
              <img src={salesforceImage} />
            </div>
          </div>
        </div>
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-m-bottom--small slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>
            2. SET REPS UP WITH THE APP
          </h3>
          <div className="slds-m-bottom--large">Reps will need to install the "Centify - Fast Fun SPIFFs" app, available from the</div>
          <div className="slds-align--absolute-center slds-container--medium slds-m-bottom--large">

            <div className="slds-image slds-m-right--large">
              <a href="https://itunes.apple.com/us/app/centify-fast-fun-spiffs/id1131699982?ls=1&mt=8" target="_blank" title="View in App Store"><img src={appstoreImage} /></a>
            </div>
            <div className="slds-image">
              <a href="https://play.google.com/store/apps/details?id=com.centify.Centify&hl=en" target="_blank" title="View in Play Store"><img src={googleplayImage} /></a>
            </div>
          </div>
        </div>
        <div className="slds-m-vertical--x-large">
          <h3 className="slds-m-bottom--small slds-text-title--caps" style={{ fontSize: 18, fontWeight: 600 }}>
            3. SETUP THE OFFICE FOR ENGAGING REPS
          </h3>
          <div className="slds-m-bottom--large">Start runnig SPIFFs on the big screen and install the AppleTV app</div>
          <div className="slds-align--absolute-center slds-container--medium slds-m-bottom--large">
            <div className="slds-image">
              <a href="https://itunes.apple.com/us/app/centify-tv-fast-fun-spiffs/id1144206024?mt=8" target="_blank" title="View in App Store"><img src={appstoreImage} /></a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default hoc(ThankYou);
