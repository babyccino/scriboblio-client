import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions'

import Menu from './Menu';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
