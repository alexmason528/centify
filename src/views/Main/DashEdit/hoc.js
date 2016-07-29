import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  currentDash: dashes.get('currentDash'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
