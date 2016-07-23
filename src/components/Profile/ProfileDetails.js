import React, { PropTypes as T } from 'react'
import {Row, Col, Image} from 'react-bootstrap'
import s from './styles.module.css'

export class ProfileDetails extends React.Component {
  static propTypes = {
    profile: T.object,
    logout: T.func
  }

  componentWillMount() {
    const { profile } = this.props
    if (profile.centifyLicense != 'Admin' && profile.centifyLicense != 'Owner')
    {
      alert("Your account is not currently enabled for access to the Centify management console. Please contact your Centify administrator.");
      this.props.logout();
    }    
  }

  render(){
    const { profile } = this.props
    // const { openid, centifyLicense, centifyOrgId, centifyUserId } = profile.user_metadata || {}
    return (
      <Row className={s.root}>
        <Col md={2} mdOffset={4}>
          <Image src={profile.picture} circle className={s.avatar} />
        </Col>
        <Col md={6}>
          <h3>Profile Details</h3>
          <p><strong>Name: </strong> {profile.name}</p>
          <p><strong>Email: </strong> {profile.email}</p>
          <p><strong>Nickname: </strong> {profile.nickname}</p>
          
          <p><strong>OpenID: </strong> {profile.openid}</p>
          <p><strong>CentifyLicense: </strong> {profile.centifyLicense}</p>
          <p><strong>CentifyOrgID: </strong> {profile.centifyOrgId}</p>
          <p><strong>CentifyUserID: </strong> {profile.centifyUserId}</p>

          <p><strong>Created At: </strong> {profile.created_at}</p>
          <p><strong>Updated At: </strong> {profile.updated_at}</p>
        </Col>
      </Row>
    )
  }
}

export default ProfileDetails;
