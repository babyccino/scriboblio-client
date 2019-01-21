import { combineReducers } from 'redux';
import { ActionTypes, isErrorAction, isDrawingAction, logAction, initialState } from '../config';

const copy = obj => Object.assign({}, obj);

function messages(messageState = initialState.messages, action) {
  if (action.type === ActionTypes.message)
    return [ ...messageState, action.data ];
  else
    return messageState;
}

function mouseAction(mouseActionState = initialState.mouseAction, action) {
  if (isDrawingAction(action))
    return copy(action);
  else
    return null;
}

function playerList(playerListState = initialState.playerList, action) {
  switch (action.type) {
  case ActionTypes.playerList: return action.playerList;
  case ActionTypes.playerConnected: return [ ...playerListState, { ...action.player, score: 0 } ];
  case ActionTypes.playerDisconnected:
    return playerListState.filter(player => player.id !== action.id);
  default: return playerListState;
  }
}

function tool(toolState = initialState.tool, action) {
  switch(action.type) {
  case ActionTypes.tool:  return action.data;
  default:                return toolState;
  }
}

function strokeWidth(strokeWidthState = initialState.strokeWidth, action) {
  switch(action.type) {
  case ActionTypes.strokeWidth: return action.data;
  default:                      return strokeWidthState;
  }
}

function strokeColor(strokeColorState = initialState.strokeColor, action) {
  switch(action.type) {
  case ActionTypes.strokeColor: return action.data;
  default:                      return strokeColorState;
  }
}

// if it's the start of a game reset the haveGueesed state
// otherwise keep it as it was
function haveGuessed(haveGuessedState = initialState.haveGuessed, action) {
  switch (action.type) {
  case ActionTypes.correctGuess:    return true;
  case ActionTypes.startSingleGame: return false;
  default:                          return haveGuessedState;
  }
}

function isDrawer(isDrawerState = initialState.isDrawer, action) {
  switch (action.type) {
  case ActionTypes.isDrawer:  return true;
  case ActionTypes.isGuesser: return false;
  default:                    return isDrawerState;
  }
}

function wordList(wordListState = initialState.wordList, action) {
  switch (action.type) {
  case ActionTypes.wordList:    return action.wordList;
  case ActionTypes.wordChoice:  return [];
  default:                      return wordListState;
  }
}

function currentlyChoosingWord(currentlyChoosingWordState = initialState.currentlyChoosingWord, action) {
  switch (action.type) {
  case ActionTypes.wordList:    return true;
  case ActionTypes.wordChoice:  return false;
  default:                      return currentlyChoosingWordState;
  }
}

function username(usernameState = initialState.username, action) {
  return action.type === ActionTypes.chooseUsername ? action.username : usernameState;
}

function inGame(inGameState = initialState.inGame, action) {
  switch (action.type) {
  case ActionTypes.serverConnected:     return true;
  case ActionTypes.serverDisconnected:  return false;
  default:                              return inGameState
  }
}

function clearCanvas(clearCanvasState = initialState.clearCanvas, action) {
  return action.type === ActionTypes.clearCanvas;
}
function undo(undoState = initialState.undo, action) {
  return action.type === ActionTypes.undo;
}

const combinedReducer = combineReducers({
  messages,
  mouseAction,
  playerList,
  tool,
  strokeWidth,
  strokeColor,
  haveGuessed,
  isDrawer,
  wordList,
  currentlyChoosingWord,
  username,
  inGame,
  clearCanvas,
  undo,
});
export default function rootReducer(state, action) {
  logAction(action);
  if (isErrorAction(action) || action.type === ActionTypes.endGame)
    return {
      ...initialState,
      username: state.username,
      messages: state.messages,
    };
  else return combinedReducer(state, action);
}
