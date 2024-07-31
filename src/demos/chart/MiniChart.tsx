import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import React, {useCallback, useEffect, useState} from "react";
import {Demo, DemoContext, getZoomFactor} from "../../Demo";
import {ConstrainedPanZoom1D} from "../../transformation/constrained/ConstrainedPanZoom1D";
import {ChartData, MinimapData} from "./ChartDemo";
import {updateChartConstraints} from "./updateChartConstraints";

export const MiniChart = ({chartData, width, height, chartPanZoom, paintChart, updateChartPanZoom}: {
  chartData: ChartData,
  width: number,
  height: number,
  chartPanZoom: ConstrainedPanZoom2D,
  updateChartPanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
  paintChart: (context: DemoContext, data: ChartData) => void
}) => {
  const [leftX, updateLeftX] = useState(0)
  const [rightX, updateRightX] = useState(width)

  const [minichartPanZoom, updateMinichartPanZoom] =
    useState(new ConstrainedPanZoom2D(new ConstrainedPanZoom1D(), new ConstrainedPanZoom1D()))

  useEffect(() => {
    updateMinichartPanZoom((prevPanZoom) =>
      updateChartConstraints(prevPanZoom, width, height, chartData, 5, 5))
  }, [chartData]);

  useEffect(() => {
    const pz = minichartPanZoom.tx.pz;
    const pzInv = chartPanZoom.tx.pz.inv();

    const leftX = pz.apply(pzInv.apply(0));
    const rightX = pz.apply(pzInv.apply(width));

    updateLeftX(leftX)
    updateRightX(rightX)
  }, [chartPanZoom]);

  const paint = useCallback((context: DemoContext, data: MinimapData) => {
    const ctx = context.canvas.getContext("2d")!
    const { leftX, rightX} = data

    ctx.resetTransform()
    ctx.fillStyle = '#d3d3d3'
    ctx.fillRect(0, 0, leftX, height)
    ctx.fillRect(rightX, 0, width, height)
    paintChart(context, data)
  }, [paintChart])


  const onDrag = useCallback(({dx}: { dx: number }) => {
    updateChartPanZoom((pz: ConstrainedPanZoom2D) => {
      const factor = pz.tx.k / minichartPanZoom.tx.k
      return pz.translateScreen(-dx * factor, 0)
    })
  }, [minichartPanZoom]);

  return (<>
    <Demo<MinimapData>
      dimensions={{canvasWidth: width, canvasHeight: height}}
      data={{...chartData, leftX, rightX}}
      panZoom={minichartPanZoom}
      updatePanZoom={updateMinichartPanZoom}
      paint={paint}
      onWheel={(p, deltaY) => {
        updateChartPanZoom(chartPanZoom.zoomXAt(p.mx, getZoomFactor(deltaY)))
      }}
      onDrag={onDrag}
      onStartDrag={({mx, my}) => mx >= leftX && mx <= rightX}
    />
  </>)
}