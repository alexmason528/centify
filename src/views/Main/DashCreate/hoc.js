import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, createDash } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  currentDash: dashes.get('currentDash'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  createDash,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
