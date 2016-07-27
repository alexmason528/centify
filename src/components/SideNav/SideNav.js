import React, { PropTypes as T } from 'react'
import styles from './styles.module.css'
import {Glyphicon} from 'react-bootstrap'
import logoImage from 'images/centify-logo.png'
import {Icon} from 'react-fa'

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
        <li className="slds-is-active"><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dashboard"/> Dashboard
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="flag-checkered"/> Dashes
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="hand-o-right"/> ToDos
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="dollar"/> Base IC
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="entity-header">
          <Icon fixedWidth name="money"/> Payouts
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="comment"/> Notifications
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="trophy"/> Gamification
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="line-chart"/> Data Analysis
        </a></li>
        <li><a href="javascript:void(0);" className="slds-navigation-list--vertical__action slds-text-link--reset" aria-describedby="folder-header">
          <Icon fixedWidth name="university"/> Budget
        </a></li>
      </ul>
    </div>
  )
}

export default SideNav;
