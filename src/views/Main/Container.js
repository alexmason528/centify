import React, { PropTypes as T } from 'react'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'

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
    const auth = this.props.route.auth;

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: auth //sends auth instance to children
      })
    }

    return (
      <div>
        {children}
      </div>
    )
  }
}

export default Container;
