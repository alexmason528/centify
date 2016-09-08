import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, createDash } from 'redux/modules/dashes';
import { getUsers } from 'redux/modules/users'
import { getTodos } from 'redux/modules/todos'
import { getBudget } from 'redux/modules/budget'
import { getDashTypes } from 'redux/modules/dashtypes'
import { getDashBanners } from 'redux/modules/dashbanners'
import { getSchemas } from 'redux/modules/schemas'
import { getGameTypes } from 'redux/modules/gametypes'

const mapStateToProps = ({ dashes, users, todos, budget, dashtypes, dashbanners, schemas, gametypes }) => ({
  // dashes
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
  // budget
  budgetAmount: budget.get('budgetAmount'),
  // dash types
  dashtypes: dashtypes.get('dashtypes'),
  loadingDashTypes: dashtypes.get('loading'),
  loadedDashTypes: dashtypes.get('loaded'),
  // dash banners
  dashbanners: dashbanners.get('dashbanners'),
  loadingDashBanners: dashbanners.get('loading'),
  loadedDashBanners: dashbanners.get('loaded'),
  // schemas
  schemas: schemas.get('schemas'),
  loadingSchemas: schemas.get('loading'),
  loadedSchemas: schemas.get('loaded'),
  // gametypes
  gametypes: gametypes.get('gametypes'),
  loadingGameTypes: gametypes.get('loading'),
  loadedGameTypes: gametypes.get('loaded'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  createDash,
  getUsers,
  getTodos,
  getBudget,
  getDashTypes,
  getDashBanners,
  getSchemas,
  getGameTypes,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
