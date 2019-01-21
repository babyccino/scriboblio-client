import React from 'react';
import './Menu.scss';

const Menu = ({ actions }) => (
  <div className="menu">
    <form onSubmit={
      event => {
        event.preventDefault();
        const username = event.currentTarget.childNodes[0].value;
        if (username.length > 0) {
          actions.chooseUsername(username);
        }
      }
    }>
      <input />
      <button type="submit">
        Choose username
      </button>
    </form>
    <button onClick={actions.findServer}>
      Join Game
    </button>
  </div>
);
export default Menu;