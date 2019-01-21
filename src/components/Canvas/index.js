import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './Canvas.scss';

import * as actions from './../../actions';
import Canvas from './Canvas';

import { Tool, Colors } from '../../config';

const mapStateToProps = state => ({
	messages: state.messages,
	mouseAction: state.mouseAction,
	playerList: state.playerList,
	tool: state.tool,
	stroke: {
		width: state.strokeWidth,
		color: state.tool === Tool.eraser ? Colors.white : state.strokeColor,
	},
	isDrawer: state.isDrawer,
	clearCanvas: state.clearCanvas,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
