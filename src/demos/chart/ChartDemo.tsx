import React, {useCallback, useMemo, useState} from "react";
import {drawLines} from "../../misc/Geometry";
import {createRandomData} from "../../misc/CreateRandomData";
import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import {ConstrainedPanZoom1D} from "../../transformation/constrained/ConstrainedPanZoom1D";
import {MainChart} from "./MainChart";
import {MiniChart} from "./MiniChart";
import styled from "@emotion/styled";

export const ChartDemo = () => {
  const canvasWidth = 640;
  const canvasHeight = 480;

  const chartData = useMemo(() => createRandomData(200), [])

  const [panZoom, updatePanZoom] =
    useState(new ConstrainedPanZoom2D(new ConstrainedPanZoom1D(), new ConstrainedPanZoom1D()))

  const paint = useCallback((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d")!
    context.resetTransform()

    drawLines(context, panZoom, chartData.data);
  }, [panZoom])

  return (<>
    <StyledColumn>
      <h2>Chart</h2>
      <MainChart
        width={canvasWidth} height={canvasHeight}
        chartData={chartData}
        panZoom={panZoom}
        updatePanZoom={updatePanZoom}
        paint={paint}
      />
      <MiniChart
        width={canvasWidth} height={50}
        chartData={chartData}
        chartPanZoom={panZoom}
        updateChartPanZoom={updatePanZoom}
      />
    </StyledColumn>
  </>)
}

const StyledColumn = styled.div`
  flex-direction: column;
`
