import React, {useCallback, useMemo, useState} from "react";
import {drawLines} from "../../misc/Geometry";
import {createRandomData} from "../../misc/CreateRandomData";
import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import {ConstrainedPanZoom1D} from "../../transformation/constrained/ConstrainedPanZoom1D";
import {MainChart} from "./MainChart";
import {MiniChart} from "./MiniChart";
import {StyledColumn} from "../../styled/StyledColumn";

const chartWidth = 640;
const chartHeight = 480;
const minimapHeight = 50

export const ChartDemo = () => {
  const chartData = useMemo(() => createRandomData(200), [])

  const [panZoom, updatePanZoom] =
    useState(new ConstrainedPanZoom2D(new ConstrainedPanZoom1D(), new ConstrainedPanZoom1D()))

  const paint = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.resetTransform()
    drawLines(ctx, panZoom, chartData.data);
  }, [panZoom])

  return (<>
    <StyledColumn>
      <h2>Chart</h2>
      <MainChart
        width={chartWidth} height={chartHeight}
        chartData={chartData}
        panZoom={panZoom}
        updatePanZoom={updatePanZoom}
        paint={paint}
      />
      <MiniChart
        width={chartWidth} height={minimapHeight}
        chartData={chartData}
        chartPanZoom={panZoom}
        updateChartPanZoom={updatePanZoom}
      />
    </StyledColumn>
  </>)
}
