import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDash, updateDash } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  currentDash: dashes.get('currentDash'),
  loading: dashes.get('loading'),
  loadingParticipants: dashes.get('loadingParticipants'),
  loadingRewards: dashes.get('loadingRewards'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDash,
  updateDash,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
