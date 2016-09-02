import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { getSchemas } from 'redux/modules/schemas';

const mapStateToProps = ({ schemas }) => ({
  schemas: schemas.get('schemas'),
  loadingSchemas: schemas.get('loading'),
  loadedSchemas: schemas.get('loaded'),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getSchemas,
}, dispatch)

export default (container) => connect(
  mapStateToProps,
  mapDispatchToProps
)(container)
