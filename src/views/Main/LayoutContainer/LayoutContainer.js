import React, { PropTypes as T } from 'react'
import { Grid, Row, Col } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import Header from 'components/Header/Header'
import SideNav from 'components/SideNav/SideNav'
import hoc from './hoc'
import styles from './styles.module.css'

export class LayoutContainer extends React.Component {
  static contextTypes = {
    router: T.object
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    const {
      auth,
    } = this.props
    const profile = auth.getProfile()
    if (profile && profile.centifyUserId) {
      this.getLoggedInUserIdentity()
    } else {
      auth.onGetProfile = this.getLoggedInUserIdentity
    }
  }

  getLoggedInUserIdentity = () => {
    const {
      auth,
      loadedIdentity,
    } = this.props
    if (!loadedIdentity) {
      const {
        centifyOrgId,
        centifyUserId,
      } = auth.getProfile()
      this.props.getUserIdentity(centifyOrgId, centifyUserId)
    }
  }

  logout = () => {
    const { auth } = this.props
    auth.logout()
    window.location.href = '/#/login'
  }

  render() {
    const {
      auth,
      identity,
      loadedIdentity,
    } = this.props

    if (!loadedIdentity) {
      return (
        <LoadingSpinner width={100} height={500} />
      )
    }

    const headerProfileData = {
      name: identity.get('DisplayName'),
      avatarUrl: identity.get('AvatarURL'),
    }
    const avatarStyle = {
      width: 50,
      height: 'auto',
      marginRight: 10,
    }
    const routeParts = this.props.location.pathname.substr(1).split("/")
    const routeName = routeParts[0]

    let children = null
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: auth //sends auth instance to children
      })
    }

    return (
      <div className="app-container">
        <Grid>
          <Row cols={6}>
            <Col cols={6}>
              <Header profile={headerProfileData} logout={this.logout}/>
            </Col>
            <Col cols={6} colsSmall={2} colsMedium={1}>
              <div className="slds-p-left--large slds-p-large--large slds-p-top--large slds-p-bottom--x-large">
                <img src={headerProfileData.avatarUrl}
                  alt="user-image" className="slds-avatar--circle" style={avatarStyle}/>
                {headerProfileData.name}
              </div>
              <SideNav routeName={routeName}/>
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

export default hoc(LayoutContainer)
