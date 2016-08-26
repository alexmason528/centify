import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';

const mapStateToProps = ({ users }) => ({

})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
