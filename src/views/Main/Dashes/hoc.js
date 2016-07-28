import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getDashesList, filterDashes } from 'redux/modules/dashes';

const mapStateToProps = ({ dashes }) => ({
  dashesList: dashes.get('list'),
  filter: dashes.get('filter'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getDashesList,
  filterDashes,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
