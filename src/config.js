const port = 8080,
      host = 'localhost';
      // host = 'ec2-13-236-152-60.ap-southeast-2.compute.amazonaws.com';

const Tool = {
  pencil: 0,
  eraser: 1,
  bucket: 2,
}

const colorArray = [
  "white",
  "green",
  "indigo",
  "blue",
  "red",
  "gold",
  "orange",
  "black",
  "gray",
]
const Colors = colorArray.reduce((acc, cur, idx) => { acc[cur] = idx; return acc }, {});

// shout outs to JS for not having enums
const actionArray = [
  "batch",

  "notEnoughPlayers",
  "drawerDisconnected",
  "failedServerConnection",

  "chooseUsername",
  "findServer",
  "serverConnected",
  "serverDisconnected",

  "playerConnected",
  "playerDisconnected",
  "playerList",

  "wordList",
  "wordChoice",

  "startMatch",
  "endMatch",
  "startRound",
  "endRound",
  "startGame",
  "endGame",
  "startGuessing",

  "isDrawer",
  "isGuesser",

  "message",
  "correctGuess",

  "tool",
  "strokeColor",
  "strokeWidth",
  "clearCanvas",
  "undo",
  "lastCoords",
  "mouseDown",
  "mouseMove",
  "mouseUp",
];
const ActionTypes = actionArray.reduce((acc, cur, idx) => {acc[cur] = idx; return acc}, {});

const serverFlag = 1 << 7;
const setServerFlag = actionType => actionType |= serverFlag;
const unsetServerFlag = actionType => actionType &= ~serverFlag;
const isMouseAction = ({ type }) => type >= ActionTypes.tool;
// defines actions that only change the canvas i.e. drawing a line
const isDrawingAction = ({ type }) => type >= ActionTypes.mouseDown;
const isLocalAction = ({ type }) => !(type & serverFlag);
const isLocalOnlyAction = ({ type }) => type >= ActionTypes.notEnoughPlayers && type <= ActionTypes.serverDisconnected;
const isErrorAction = ({ type }) => (type >= ActionTypes.notEnoughPlayers && type <= ActionTypes.failedServerConnection);
const isEmitableAction = action => isLocalAction(action) && !isLocalOnlyAction(action);

function logAction(action) {
  if (typeof action.type === "string" && action.type.startsWith("@@")) return;
  // console.log("is server:", serverFlag&action.type);
  // convert action to string.
  const type = actionArray[unsetServerFlag(action.type)];
  console.log({ ...action, type });
}

const initialState = {
  inGame: false,
  messages: [],
  mouseAction: null,
  playerList: [],
  tool: 0,
  strokeWidth: 4,
  strokeColor: "black",
  haveGuessed: false,
  isDrawer: false,
  wordList: [],
  currentlyChoosingWord: false,
  username: "",
  clearCanvas: false,
  undo: false,
};

const uri = `http://${host}:${port}`;
export {
  port,
  host,
  Tool,
  ActionTypes,
  setServerFlag,
  unsetServerFlag,
  isMouseAction,
  isDrawingAction,
  isLocalAction,
  isLocalOnlyAction,
  isErrorAction,
  isEmitableAction,
  logAction,
  initialState,
  uri,
  colorArray,
  Colors,
};
