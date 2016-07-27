import React, { PropTypes as T } from 'react'
import { Glyphicon } from 'react-bootstrap'
import { Link } from 'react-router'

import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'
import { Icon } from 'react-fa'

const SideNav = () => {
  const logoStyle = {
    height: 40,
    width: 'auto'
  }
  const avatarStyle = {
    width: 35,
    height: 'auto',
    marginRight: 10,
  }
  return (
    <div className="slds-grid slds-grid--vertical">
      <ul className="slds-navigation-list--vertical slds-has-block-links--space">
        <li className="slds-is-active"><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dashboard"/> Dashboard
        </Link></li>
        <li><Link to="/dashes"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="flag-checkered"/> Dashes
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="hand-o-right"/> ToDos
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dollar"/> Base IC
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="money"/> Payouts
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="comment"/> Notifications
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="trophy"/> Gamification
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="line-chart"/> Data Analysis
        </Link></li>
        <li><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="university"/> Budget
        </Link></li>
      </ul>
    </div>
  )
}

export default SideNav;
