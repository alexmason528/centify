import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, createDash } from 'redux/modules/dashes';
import { getUsers } from 'redux/modules/users'

const mapStateToProps = ({ dashes, users }) => ({
  // dashes
  currentDash: dashes.get('currentDash'),
  // users
  users: users.get('users'),
  loadingUsers: users.get('loadingUsers'),
  loadedUsers: users.get('loadedUsers'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  createDash,
  getUsers,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
