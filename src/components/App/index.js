import { connect } from 'react-redux';

import App from './App';

const mapStateToProps = state => ({
  currentlyChoosingWord: state.currentlyChoosingWord,
  isDrawer: state.isDrawer,
  inGame: state.inGame,
});

export default connect(
  mapStateToProps,
)(App);
