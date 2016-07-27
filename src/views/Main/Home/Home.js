import React, { PropTypes as T } from 'react'
import {Button, Glyphicon} from 'react-bootstrap'
import AuthService from 'utils/AuthService'
import ProfileDetails from 'components/Profile/ProfileDetails'
import ProfileEdit from 'components/Profile/ProfileEdit'
import styles from './styles.module.css'

import images from 'images/centify-logo.png'
import {Icon} from 'react-fa'

export class Home extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.auth.getProfile()
    }
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  logout(){
    this.props.auth.logout()
    this.context.router.push('/login');
  }

  render(){
    const { profile } = this.state
    // return (
    //   <div className={styles.root}>
    //     <h2>Home</h2>
    //     <ProfileDetails profile={profile} logout={this.logout.bind(this)}></ProfileDetails>
    //     <ProfileEdit profile={profile} auth={this.props.auth}></ProfileEdit>
    //     <Button onClick={this.logout.bind(this)}>Logout</Button>
    //   </div>
    // )
    return (
      <div className={styles.root}>
        <div className="pull-right">
          <ul className="info-menu list-inline">
            <li className="profile-wrapper">
              <a href="#" data-toggle="dropdown" className="toggle">
                <img src="http://jaybabani.com/complete-admin/v2.0/preview/data/profile/profile-socialmedia.jpg" alt="user-image" className="img-circle img-inline" />
                <span>John<i className="fa fa-angle-down"></i></span>
              </a>
            </li>
            <li className="question-wrapper">
              <a href="#">
                <Glyphicon glyph="question-sign" />
              </a>
            </li>
            <li className="settings-wrapper">
              <a href="#">
                <Glyphicon glyph="cog" />
              </a>
            </li>
            <li className="chat-wrapper">
              <a href="#">
                <Icon name="comment-o" />
              </a>
            </li>
          </ul>
          
        </div>
      </div>
    )
  }
}

export default Home;
