import { ActionTypes, Colors } from './../config';

export const message = message => ({
	type: ActionTypes.message,
	message,
});

export const changeTool = data => ({
	type: ActionTypes.tool,
	data,
});

export const changeStrokeColor = data => {
	if (typeof data === "string") data = Colors[data];
	return {
		type: ActionTypes.strokeColor,
		data,
	};
};
export const changeStrokeWidth = data => ({
	type: ActionTypes.strokeWidth,
	data
});

export const clearCanvas = () => ({
	type: ActionTypes.clearCanvas,
});
export const undo = () => ({
	type: ActionTypes.undo,
});

export const mouseDown = coords => ({
	type: ActionTypes.mouseDown,
	coords,
});
export const mouseMove = coords => ({
	type: ActionTypes.mouseMove,
	coords,
});
export const mouseUp = coords => ({
	type: ActionTypes.mouseUp,
	coords,
});
export const lastCoords = coords => ({
	type: ActionTypes.lastCoords,
	coords,
});

export const wordChoice = word => ({
	type: ActionTypes.wordChoice,
	word,
});

export const chooseUsername = username => ({
	type: ActionTypes.chooseUsername,
	username,
});

export const findServer = () => ({
	type: ActionTypes.findServer,
});
