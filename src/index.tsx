import React from 'react';
import ReactDOM from 'react-dom/client';

import {RectanglesDemo} from "./demos/RectanglesDemo";
import {ChartDemo} from "./demos/chart/ChartDemo";
import {StyledFlexRow} from "./styled/StyledFlexRow";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StyledFlexRow>
      <ChartDemo/>
      <RectanglesDemo/>
    </StyledFlexRow>
  </React.StrictMode>
);

