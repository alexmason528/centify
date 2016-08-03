import React, { PropTypes as T } from 'react'
import { Button } from 'react-lightning-design-system'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'

export class Login extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const { auth } = this.props
    if (this.props.routeParams.token) {
      return (
        <LoadingSpinner width={100} height={500} />
      )
    }
    return (
      <div className={styles.root}>
        <h2>Login</h2>
        <div className={styles.toolbar}>
          <Button type="brand" onClick={auth.login.bind(this)}>Login</Button>
        </div>
      </div>
    )
  }
}

export default Login;
