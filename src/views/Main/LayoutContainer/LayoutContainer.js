import React, { PropTypes as T } from 'react'
import styles from './styles.module.css'
import Header from 'components/Header/Header'
import SideNav from 'components/SideNav/SideNav'
import { Grid, Row, Col } from 'react-lightning-design-system'

export class LayoutContainer extends React.Component {
  static contextTypes = {
    router: T.object
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    const auth = this.props.auth;
    const routeParts = this.props.location.pathname.substr(1).split("/")
    const routeName = routeParts[0];
    const {
      name,
      picture_thumbnail,
    } = auth.getProfile();

    const headerProfileData = {
      name,
      picture_thumbnail,
    }

    const avatarStyle = {
      width: 50,
      height: 'auto',
      marginRight: 10,
    }

    let children = null;
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
              <Header profile={headerProfileData}/>
            </Col>
            <Col cols={6} colsSmall={2} colsMedium={1}>
              <div className="slds-p-left--large slds-p-large--large slds-p-top--large slds-p-bottom--x-large">
                <img src={picture_thumbnail}
                  alt="user-image" className="slds-avatar--circle" style={avatarStyle}/>
                {name}
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

export default LayoutContainer;
