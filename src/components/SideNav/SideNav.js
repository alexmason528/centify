import React, { PropTypes as T } from 'react'
import { Link } from 'react-router'

import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'
import { Icon } from 'react-fa'

const SideNav = ({ routeName, notLinked }) => {
  const logoStyle = {
    height: 40,
    width: 'auto'
  }
  const avatarStyle = {
    width: 35,
    height: 'auto',
    marginRight: 10,
  }
  if (notLinked) {
    return (
      <div className="slds-grid slds-grid--vertical">
        <ul className="slds-navigation-list--vertical slds-has-block-links--space">
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="dashboard"/> Dashboard
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="flag-checkered"/> Dashes
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="hand-o-right"/> ToDos
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
            <Icon fixedWidth name="dollar"/> Base IC
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="money"/> Payouts
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="comment"/> Notifications
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="trophy"/> Gamification
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="line-chart"/> Data Analysis
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="university"/> Budget
          </Link></li>
          <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
            <Icon fixedWidth name="television"/> Apple TV Activation
          </Link></li>
        </ul>
      </div>
    )
  }
  return (
    <div className="slds-grid slds-grid--vertical">
      <ul className="slds-navigation-list--vertical slds-has-block-links--space">
        <li className={routeName == 'home' ? "slds-is-active" : ""}><Link to="/home"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dashboard"/> Dashboard
        </Link></li>
        <li className={routeName == 'dashes' ? "slds-is-active" : ""}><Link to="/dashes"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="flag-checkered"/> Dashes
        </Link></li>
        <li className={routeName == 'todos' ? "slds-is-active" : ""}><Link to="/todos"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="hand-o-right"/> ToDos
        </Link></li>
        <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dollar"/> Base IC
        </Link></li>
        <li className={routeName == 'payouts' ? "slds-is-active" : ""}><Link to="/payouts"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="money"/> Payouts
        </Link></li>
        <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="comment"/> Notifications
        </Link></li>
        <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="trophy"/> Gamification
        </Link></li>
        <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="line-chart"/> Data Analysis
        </Link></li>
        <li className={styles.disabled}><Link to="/"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="university"/> Budget
        </Link></li>
        <li className={routeName == 'appletv' ? "slds-is-active" : ""}><Link to="/appletv"  className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="television"/> Apple TV Activation
        </Link></li>
      </ul>
    </div>
  )
}

export default SideNav;
