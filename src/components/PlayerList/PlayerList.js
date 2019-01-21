import React from 'react';
import './PlayerList.scss';

export const Player = ({ player }) => (
  <div className="player">
    <div className="text">{player.username}</div>
    <div className="text">score: {player.score ? player.score : 0}</div>
  </div>
);
export const PlayerList = ({ playerList }) => (
  <div className="playerList" style={{ gridTemplateRows: `repeat(${playerList.length}, 1fr)` }}>
    {playerList.map(player => <Player key={player.id} player={player} />)}
  </div>
);
