import React, { PropTypes as T } from 'react'
import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'
import {Icon} from 'react-fa'

const Header = ({ profile }) => {
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
    <div className="slds-page-header" role="banner">
      <div className="slds-media slds-media--center">
        <div className={'slds-media__figure ' + styles.headerLogo}>
          <img src={logoImage} style={logoStyle}/>
        </div>
        <div className="pull-right">
          <ul className="info-menu list-inline">
            <li className={styles.rightSideIcons}>
              <a href="#">
                <Icon name="question-circle" />
              </a>
            </li>
            <li className={styles.rightSideIcons}>
              <a href="#">
                <Icon name="cog" />
              </a>
            </li>
            <li className={styles.rightSideIcons}>
              <a href="#">
                <Icon name="comment-o" />
              </a>
            </li>
            <li className={styles.profileMenu}>
              <a href="#" data-toggle="dropdown" className="toggle">
                <img src={profile.avatarUrl}
                  alt="user-image" className="slds-avatar--circle" style={avatarStyle}/>
                <span>{profile.name} <i className="fa fa-angle-down"></i></span>
              </a>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  )
}

export default Header;
