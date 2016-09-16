import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, approveDash, resendInvitations } from 'redux/modules/dashes'
import { getUsers } from 'redux/modules/users'
import { push } from 'react-router-redux';

const mapStateToProps = ({ dashes, users, todos }) => ({
  // dash
  currentDash: dashes.get('currentDash'),
  loading: dashes.get('loading'),
  loaded: dashes.get('loaded'),
  loadingParticipants: dashes.get('loadingParticipants'),
  loadingRewards: dashes.get('loadingRewards'),
  loadingTodos: dashes.get('loadingTodos'),
  // users
  users: users.get('users'),
  loadingUsers: users.get('loadingUsers'),
  loadedUsers: users.get('loadedUsers'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  getUsers,
  push,
  approveDash,
  resendInvitations,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
