import React from 'react';
import './WordChoice.scss';

export default ({ wordList, actions }) => (
  <div className="word-container">
    { wordList.map(word => <button onClick={() => actions.wordChoice(word)}>{ word }</button>) }
  </div>
);
