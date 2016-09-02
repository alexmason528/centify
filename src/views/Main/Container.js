import React, { PropTypes as T } from 'react'
import { util, Toast } from 'react-lightning-design-system'
import AuthService from 'utils/AuthService'
import styles from './styles.module.css'


export class Container extends React.Component {
  static contextTypes = {
    router: T.object,
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  static childContextTypes = {
    notify: T.func,
    auth: T.object,
  }

  getChildContext = () => {
    return {
      notify: this.notify,
      auth: this.props.route.auth,
    }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      profile: props.route.auth.getProfile(),
      notifications: [],
    }
    props.route.auth.on('profile_updated', (newProfile) => {
      this.setState({profile: newProfile})
    })
    util.setAssetRoot('')
  }

  notify = (msg, level) => {
    const { notifications } = this.state
    notifications.push({
      message: msg,
      level
    })
    this.setState({
      notifications: notifications.slice(-5)
    })
    if (this.removeTimer) {
      clearTimeout(this.removeTimer)
    }
    this.removeTimer = setTimeout(this.removeLastNotification, 3000)
  }

  onCloseToast = (index) => {
    const { notifications } = this.state
    notifications.splice(index, 1)
    this.setState({
      notifications
    })
  }

  removeLastNotification = () => {
    const { notifications } = this.state
    if (notifications.length > 0) {
      notifications.splice(0, 1)
      this.setState({
        notifications
      })
      this.removeTimer = setTimeout(this.removeLastNotification, 3000)
    } else {
      clearTimeout(this.removeTimer)
      this.removeTimer = 0
    }
  }

  logout(){
    this.props.route.auth.logout()
    this.context.router.push('/login');
  }

  componentDidMount() {
    this.removeTimer = 0
  }

  componentWillUnmount() {
    if (this.removeTimer) {
      clearTimeout(this.removeTimer)
    }
  }

  render() {
    const auth = this.props.route.auth;

    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: auth //sends auth instance to children
      })
    }

    const { notifications } = this.state

    return (
      <div>
        <div className="slds-notify_container">
          {notifications.map((notif, index) => (
            <div key={index}>
              <Toast level={notif.level} onClose={this.onCloseToast.bind(this, index)}>
                {notif.message}
              </Toast>
            </div>
          ))}
        </div>
        {children}
      </div>
    )
  }
}

export default Container;
