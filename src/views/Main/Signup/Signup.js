import React, { PropTypes as T } from 'react'

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner'
import AuthService from 'utils/AuthService'
import hoc from './hoc'

export class Signup extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  componentDidMount() {
    const { auth } = this.props
    const token = this.props.params.token
    if (token) {
      auth.setToken(token)
      this.props.push('/')
    }
  }

  render() {
    const { auth } = this.props
    return (
      <LoadingSpinner width={100} height={500} />
    )
  }
}

export default hoc(Signup)
