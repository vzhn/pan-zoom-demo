import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import React, {useCallback, useEffect, useState} from "react";
import {Demo, getZoomFactor} from "../../Demo";
import {updateChartConstraints} from "./updateChartConstraints";
import {ChartData, MinimapData} from "./ChartData";
import {drawLines} from "../../misc/Geometry";

export const MiniChart = ({chartData, width, height, chartPanZoom, updateChartPanZoom}: {
  chartData: ChartData,
  width: number,
  height: number,
  chartPanZoom: ConstrainedPanZoom2D,
  updateChartPanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
}) => {
  const [leftX, updateLeftX] = useState(0)
  const [rightX, updateRightX] = useState(width)

  const [minichartPanZoom, updateMinichartPanZoom] =
    useState(new ConstrainedPanZoom2D())

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

  const paint = useCallback((ctx: CanvasRenderingContext2D, { leftX, rightX}: MinimapData) => {
    ctx.resetTransform()

    ctx.fillStyle = '#d3d3d3'
    ctx.fillRect(0, 0, leftX, height)
    ctx.fillRect(rightX, 0, width, height)

    drawLines(ctx, minichartPanZoom, chartData.data);
  }, [minichartPanZoom])

  const onDrag = useCallback(({dx}: { dx: number }) => {
    updateChartPanZoom((pz: ConstrainedPanZoom2D) => {
      const factor = pz.tx.k / minichartPanZoom.tx.k
      return pz.translateScreen(-dx * factor, 0)
    })
  }, [minichartPanZoom]);

  return (<>
    <Demo<MinimapData>
      dimensions={{ canvasWidth: width, canvasHeight: height }}
      data={{ ...chartData, leftX, rightX }}
      panZoom={minichartPanZoom}
      updatePanZoom={updateMinichartPanZoom}
      paint={paint}
      onDrag={onDrag}
      onWheel={({mx}, deltaY) => {
        if (mx >= leftX && mx <= rightX) {
          updateChartPanZoom(cpz => cpz.zoomXAt(mx, getZoomFactor(deltaY)))
        }
      }}
      onStartDrag={({mx}) => mx >= leftX && mx <= rightX}
    />
  </>)
}