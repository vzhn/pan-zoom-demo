import React from 'react';
import ReactDOM from 'react-dom/client';

import {RectanglesDemo} from "./demos/RectanglesDemo";
import {ChartDemo} from "./demos/ChartDemo";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChartDemo/>
    {/*<RectanglesDemo/>*/}
  </React.StrictMode>
);
