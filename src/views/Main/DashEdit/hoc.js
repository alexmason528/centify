import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, updateDash } from 'redux/modules/dashes'
import { getUsers } from 'redux/modules/users'
import { getTodos } from 'redux/modules/todos'
import { getBudget } from 'redux/modules/budget'

const mapStateToProps = ({ dashes, users, todos }) => ({
  // dash
  currentDash: dashes.get('currentDash'),
  loading: dashes.get('loading'),
  loadingParticipants: dashes.get('loadingParticipants'),
  loadingRewards: dashes.get('loadingRewards'),
  loadingTodos: dashes.get('loadingTodos'),
  // users
  users: users.get('users'),
  loadingUsers: users.get('loadingUsers'),
  loadedUsers: users.get('loadedUsers'),
  // todos
  todos: todos.get('todos'),
  loadingTodos: users.get('loadingTodos'),
  loadedTodos: users.get('loadedTodos'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  updateDash,
  getUsers,
  getTodos,
  getBudget,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
