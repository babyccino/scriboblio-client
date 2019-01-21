import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './../../actions';
import WordChoice from './WordChoice';

const mapStateToProps = state => ({
  wordList: state.wordList,
});

// don't need all actions change this
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WordChoice);
