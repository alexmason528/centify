import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, createDash } from 'redux/modules/dashes';
import { getUsers } from 'redux/modules/users'
import { getTodos } from 'redux/modules/todos'
import { getBudget } from 'redux/modules/budget'

const mapStateToProps = ({ dashes, users, todos, budget }) => ({
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
  // budget
  budgetAmount: budget.get('budgetAmount'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  createDash,
  getUsers,
  getTodos,
  getBudget,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
