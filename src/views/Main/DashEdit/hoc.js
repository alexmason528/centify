import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, updateDash } from 'redux/modules/dashes'
import { getUsers } from 'redux/modules/users'

const mapStateToProps = ({ dashes, users }) => ({
  // dashes
  currentDash: dashes.get('currentDash'),
  loading: dashes.get('loading'),
  loadingParticipants: dashes.get('loadingParticipants'),
  loadingRewards: dashes.get('loadingRewards'),
  // users
  users: users.get('users'),
  loadingUsers: users.get('loadingUsers'),
  loadedUsers: users.get('loadedUsers'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  updateDash,
  getUsers,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
