import React, { PropTypes as T } from 'react'
import { Button } from 'react-lightning-design-system'

import AuthService from 'utils/AuthService'
import hoc from './hoc'
import styles from './styles.module.css'

export class AccountNotLinked extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  onLogout = () => {
    const { auth } = this.props
    auth.logout();
    this.props.push('/login')
  }

  onSignup = () => {
    window.location.href = "https://centify.com"
  }

  render() {
    const titleStyle = {
      fontWeight: 700,
      fontSize: 22,
      marginTop: 20,
      marginBottom: 30,
    }
    const { auth } = this.props
    return (
      <div>
        <h2 style={titleStyle}>Account not linked to Centify</h2>
        Your account isn't currently linked to Centify. Sign up at <a href="https://centify.com">https://centify.com</a> or ask your sales manager to enable your account. 
        <div style={{ marginTop: 30 }}>
          <Button type="neutral" onClick={this.onLogout}>Logout</Button>
          &nbsp;
          <Button type="brand" onClick={this.onSignup}>Signup</Button>
        </div>
      </div>
    )
  }
}

export default hoc(AccountNotLinked)
