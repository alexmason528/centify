import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getBudget, setBudget } from 'redux/modules/budget'

const mapStateToProps = ({ users, budget }) => ({
	budgetAmount: budget.get('budgetAmount'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  push,
  getBudget,
  setBudget
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
