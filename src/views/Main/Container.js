import React, { PropTypes as T } from 'react'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'
import Header from 'components/Header/Header';
import SideNav from 'components/SideNav/SideNav';
import { Grid, Row, Col } from 'react-lightning-design-system';

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.route.auth.getProfile()
    }
    props.route.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
  }

  logout(){
    this.props.route.auth.logout()
    this.context.router.push('/login');
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
        <Grid>
          <Row cols={6}>
            <Col cols={6}>
              <Header/>
            </Col>
            <Col cols={6} colsSmall={2} colsMedium={1}>
              <div className="slds-p-left--large slds-p-large--large slds-p-top--medium slds-p-bottom--xx-large">
                <img src="http://jaybabani.com/complete-admin/v2.0/preview/data/profile/profile-socialmedia.jpg" 
                  alt="user-image" className="img-circle img-inline" style={avatarStyle}/>
                John Smith
              </div>
              <SideNav/>
            </Col>
            <Col cols={6} colsSmall={4} colsMedium={5}>
              {children}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Container;
