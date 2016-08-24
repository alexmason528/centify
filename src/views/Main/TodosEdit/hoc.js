import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import {
  getTodos,
  setTodoStatus,
  updateTodo,
} from 'redux/modules/todos';

const mapStateToProps = ({ todos }) => ({
  todos: todos.get('todos'),
  loadingTodos: todos.get('loadingTodos'),
  loadedTodos: todos.get('loadedTodos'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  getTodos,
  setTodoStatus,
  updateTodo,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
