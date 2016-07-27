import React, { PropTypes as T } from 'react'
import styles from './styles.module.css'
import Header from 'components/Header/Header';
import SideNav from 'components/SideNav/SideNav';

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  render() {
    const avatarStyle = {
      width: 50,
      height: 'auto',
      marginRight: 10,
    }

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance to children
      })
    }

    return (
      <div className="app-container">
        <Header/>
        <div className={styles.sideNavigation + ' slds-float--left'}>
          <div className="slds-p-left--large slds-p-large--large slds-p-top--medium slds-p-bottom--xx-large">
            <img src="http://jaybabani.com/complete-admin/v2.0/preview/data/profile/profile-socialmedia.jpg" 
              alt="user-image" className="img-circle img-inline" style={avatarStyle}/>
            John Smith
          </div>
          <SideNav/>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    )
  }
}

export default Container;
