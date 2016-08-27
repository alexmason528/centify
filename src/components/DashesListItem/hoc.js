import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getDashesList, filterDashes, deleteDash, cancelDash } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }, ownProps) => ({
  dash: dashes.getIn(['list', ownProps.id])
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deleteDash,
  cancelDash,
  push,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
