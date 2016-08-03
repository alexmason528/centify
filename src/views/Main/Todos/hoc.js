import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getTodos } from 'redux/modules/todos';

const mapStateToProps = ({ todos }) => ({
  todos: todos.get('todos'),
  loadingTodos: todos.get('loadingTodos'),
  loadedTodos: todos.get('loadedTodos'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getTodos
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
