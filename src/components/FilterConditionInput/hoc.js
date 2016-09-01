import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getGlobalBasicFilters, getOrgBasicFilters } from 'redux/modules/filters';

const mapStateToProps = ({ filters }) => ({
  globalBasicFilters: filters.get('globalBasicFilters'),
  loadingGlobal: filters.get('loadingGlobalBasicFilters'),
  loadedGlobal: filters.get('loadedGlobalBasicFilters'),
  orgBasicFilters: filters.get('orgBasicFilters'),
  loadingOrg: filters.get('loadingOrgBasicFilters'),
  loadedOrg: filters.get('loadedOrgBasicFilters'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getGlobalBasicFilters,
  getOrgBasicFilters,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
