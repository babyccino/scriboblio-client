import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './../../actions';
import { Tools } from './Tools';

const mapStateToProps = state => ({
  tool: state.tool,
  stroke: {
    color: state.strokeColor,
    width: state.strokeWidth,
  },
  actions: state.actions,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tools);
