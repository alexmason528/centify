import React, { PropTypes as T } from 'react'
import { Button } from 'react-lightning-design-system'

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

  componentDidMount() {
    this.props.auth.login()
  }

  render() {
    const { auth } = this.props
    return (
      <div className={styles.root}>
        <div className={styles.table} >
            <div className={styles.cell}>
              <div className={styles.content}>
                <div id="loginContainer" className={styles.toolbar}>
                  <Button type="brand" onClick={auth.login.bind(this)}>MyCentify Login</Button>
                </div>      
              </div>
            </div>
          </div>        
      </div>
    )
  }
}

export default Login
