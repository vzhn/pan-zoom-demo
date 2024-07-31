import React, {useCallback, useMemo, useState} from "react";
import {DemoContext} from "../../Demo";
import {drawLines} from "../../misc/Geometry";
import {createRandomData} from "../../misc/CreateRandomData";
import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import {ConstrainedPanZoom1D} from "../../transformation/constrained/ConstrainedPanZoom1D";
import {MainChart} from "./MainChart";
import {MiniChart} from "./MiniChart";

export type ChartData = {
  data: number[]
  dataMin: number,
  dataMax: number
}

export type MinimapData = ChartData & { leftX: number, rightX: number}

export const ChartDemo = () => {
  const canvasWidth = 640;
  const canvasHeight = 480;

  const chartData = useMemo(() => createRandomData(200), [])

  const [panZoom, updatePanZoom] =
    useState(new ConstrainedPanZoom2D(new ConstrainedPanZoom1D(), new ConstrainedPanZoom1D()))

  const paint = useCallback(({canvas, pz}: DemoContext) => {
    const context = canvas.getContext("2d")!
    context.resetTransform()

    drawLines(context, pz, chartData.data);
  }, [])

  return (<>
    <div style={{flexDirection: "column"}}>
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
        paintChart={paint}
      />
    </div>
  </>)
}
