import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Chat from './Chat';

import * as actions from './../../actions';

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
