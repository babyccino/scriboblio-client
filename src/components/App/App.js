import React from 'react';
import './App.scss';

import Canvas         from '../Canvas';
import ColorSelectors from '../ColorSelectors';
import Tools          from '../Tools';
import WordChoice     from '../WordChoice';
import Chat           from '../Chat';
import PlayerList     from '../PlayerList';
import Menu           from '../Menu';

export default ({ currentlyChoosingWord, isDrawer, inGame }) => (
  inGame ?
  <div className="appContainer">
    <div className="playerListContainer">
      <PlayerList />
    </div>
    <div className="canvasTools">
      <Canvas width={400} height={400} />
      { isDrawer ?
        <div className="container">
          <ColorSelectors />
          <Tools />
        </div>
        : null
      }
      { currentlyChoosingWord ?
        <WordChoice /> : null
      }
    </div>
    <div className="chatContainter">
      <Chat />
    </div>
  </div>
  :
  <div className="appContainer">
    <Menu />
  </div>
);
