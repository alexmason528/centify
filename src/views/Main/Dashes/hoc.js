import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getDashesList, filterDashes, deleteDash, cancelDash, activateDash, completeDash } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  dashesList: dashes.get('list'),
  filter: dashes.get('filter'),
  loadingList: dashes.get('loadingList'),
  loadedList: dashes.get('loadedList'),
  storeUpdateIndicator: dashes.get('storeUpdateIndicator'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDashesList,
  filterDashes,
  activateDash,
  deleteDash,
  completeDash,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
