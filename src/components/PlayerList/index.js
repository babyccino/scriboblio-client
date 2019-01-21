import { connect } from 'react-redux';
import { PlayerList } from './PlayerList';

const mapStateToProps = state => ({
  playerList: state.playerList,
});

export default connect(
  mapStateToProps,
)(PlayerList);
