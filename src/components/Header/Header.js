import React, { Component } from 'react'
import styles from './styles.module.css'
import logoImage from 'images/centify-logo.png'
import {Icon} from 'react-fa'


class Header extends Component {

  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false
    }
  }

  onToggleMenu = () => {
    const menuOpen = this.state.menuOpen
    this.setState({
      menuOpen: !menuOpen
    })
  }

  onLogout = () => {
    if (this.props.logout) {
      this.props.logout()
    }
  }

  render() {
    const { profile } = this.props
    const { menuOpen } = this.state
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
          {
            this.props.notLinked ?
            undefined
            :
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
                  <img src={profile.avatarUrl} alt="user-image" className="slds-avatar--circle" style={avatarStyle}/>
                  <div className="slds-dropdown-trigger slds-dropdown-trigger--click slds-is-open" aria-expanded="true">
                    <a href="javascript:void(0)" aria-haspopup="true" onClick={this.onToggleMenu}>
                      <span>{profile.name}</span>&nbsp;<i className="fa fa-angle-down"></i>
                    </a>
                    {
                      menuOpen ? 
                      <div className="slds-dropdown slds-dropdown--right">
                        <ul className="dropdown__list" role="menu">
                          <li className="slds-dropdown__item">
                            <a href="javascript:void(0);" role="menuitem" onClick={this.onLogout}>
                              <p className="slds-truncate">Logout</p>
                            </a>
                          </li>
                        </ul>
                      </div>
                      :
                      ''
                    }
                  </div>
                </li>
              </ul>
              
            </div>
          }
        </div>
      </div>
    )
  }
}

export default Header;
