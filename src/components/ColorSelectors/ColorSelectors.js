import React from 'react';
import './ColorSelectors.scss';

import { Tool, colorArray } from '../../config.js';

export default ({ tool, stroke, actions }) => (
  <div className="color-grid">
    {colorArray.map(color => (
      <div
        style={{ background: color }}
        onClick={() => {
          if (stroke.color !== color && tool !== Tool.eraser)
            actions.changeStrokeColor(color);
        }}
      />
    ))}
  </div>
);
