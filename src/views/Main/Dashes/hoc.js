import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getDashesList, filterDashes } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  dashesList: dashes.get('list'),
  filter: dashes.get('filter'),
  loadingList: dashes.get('loadingList'),
  loadedList: dashes.get('loadedList'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDashesList,
  filterDashes,
  push,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
