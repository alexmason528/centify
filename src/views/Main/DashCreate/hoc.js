import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, createDash } from 'redux/modules/dashes';
import { getUsers } from 'redux/modules/users'
import { getTodos } from 'redux/modules/todos'

const mapStateToProps = ({ dashes, users, todos }) => ({
  // dashes
  currentDash: dashes.get('currentDash'),
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
  createDash,
  getUsers,
  getTodos,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
