import React from 'react';
import './Chat.scss';

const Chat = ({messages, actions}) => (
  <div className="chat">
    <div className="messages">
      {messages.join('\n')}
    </div>
    <form onSubmit={
      event => {
        event.preventDefault();
        const nonWhitespaceRegex = /[^\s]/;
        let inputNode = event.currentTarget.childNodes[0];
        if (nonWhitespaceRegex.test(inputNode.value)) {
          actions.message(inputNode.value);
          inputNode.value = '';
        }
      }
    }>
      <input />
      <button type="submit">
        Send
      </button>
    </form>
  </div>
);
export default Chat;