import IO from 'socket.io-client';

import axios from 'axios';

import { unsetServerFlag, setServerFlag, isEmitableAction, ActionTypes } from './../config';

export const socketMiddleware = store => {
  let socket = null;

  return next => action => {
    if (socket && isEmitableAction(action)) {
      action.type = setServerFlag(action.type);
      socket.emit('action', action);
    }
    action.type = unsetServerFlag(action.type);
    
    if (action.type === ActionTypes.findServer) {
      const username = store.getState().username;
      if (username && username.length > 0) {
        const opt = {
          timeout: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
        };
        const connectionProxyUri = 'http://localhost:8080/public';
        axios.get(connectionProxyUri, opt)
          .then(res => {
            const uri = res.data;
            socket = IO(`${uri}?username=${username}`);
            socket.on('connect', () => store.dispatch({ type: ActionTypes.serverConnected }));
            socket.on('disconnect', () => store.dispatch({ type: ActionTypes.serverDisconnected }));
            socket.on('action', action => {
              action.type = setServerFlag(action.type);
              if (action.type === ActionTypes.batch)
                for (const batchAction of action.actions) store.dispatch(batchAction);
              else
                store.dispatch(action);
            });
          })
          .catch(() => store.dispatch({ type: ActionTypes.failedServerConnection }));
      } else {

      }
    } else if (action.type === ActionTypes.serverDisconnected) {
      if (socket) socket.disconnect();
      socket = null;
    }
    return next(action);
  };
};