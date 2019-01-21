import React from 'react';
import './Tools.scss';

import { Tool } from './../../config.js';

const toolIconClassNameLookup = [
  "fas fa-pencil-alt",
  "fas fa-eraser",
  "fas fa-fill",
];
export const ToolButton = ({ tool, toolState, callback }) => (
  <a onClick={() => { if (toolState !== tool) callback(tool); }}>
    <i style={{ color: toolState === tool ? "black" : "gray" }} className={toolIconClassNameLookup[tool]} />
  </a>
);
export const Tools = ({ tool, stroke, actions }) => (
  <div className="tools">
    <div className="stroke">
      <div style={{ background: stroke.color, transition: '0s' }} />
    </div>
    <div className="size">
      <a onClick={() => actions.changeStrokeWidth(stroke.width + 2)}>
        <i style={{ color: tool !== Tool.bucket ? "black" : "gray" }} className="fas fa-plus" />
      </a>
      <a onClick={() => { if (stroke.width > 4) actions.changeStrokeWidth(stroke.width - 2); }}>
        <i style={{ color: tool !== Tool.bucket ? "black" : "gray" }} className="fas fa-minus" />
      </a>
    </div>
    <ToolButton tool={Tool.pencil} toolState={tool} callback={actions.changeTool} />
    <ToolButton tool={Tool.eraser} toolState={tool} callback={actions.changeTool} />
    <ToolButton tool={Tool.bucket} toolState={tool} callback={actions.changeTool} />
    <a onClick={actions.undo}>
      <i className="fas fa-undo" />
    </a>
    <a onClick={actions.clear}>
      <i className="fas fa-times" />
    </a>
  </div>
);