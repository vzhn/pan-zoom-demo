import React from 'react';
import ReactDOM from 'react-dom/client';

import {RectanglesDemo} from "./demos/RectanglesDemo";
import {ChartDemo} from "./demos/chart/ChartDemo";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <div style={{display: "flex", flexDirection: "row", gap: 10}}>
      <ChartDemo/>
      <RectanglesDemo/>
    </div>
  </React.StrictMode>
);
