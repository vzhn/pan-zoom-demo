import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import React, {useCallback, useEffect} from "react";
import {Demo,  getZoomFactor} from "../../Demo";
import {updateChartConstraints} from "./updateChartConstraints";
import {ChartData} from "./ChartData";

export const MainChart = ({chartData, width, height, panZoom, paint, updatePanZoom}: {
  width: number, height: number,
  chartData: ChartData,
  panZoom: ConstrainedPanZoom2D,
  updatePanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
  paint: (ctx: CanvasRenderingContext2D, data: ChartData) => void
}) => {
  useEffect(() => {
    updatePanZoom((prevPanZoom) =>
      updateChartConstraints(prevPanZoom, width, height, chartData, 10, 10))
  }, [width, height, chartData]);

  const onDrag = useCallback(({dx, dy}: { dx: number, dy: number }) => {
    updatePanZoom(pz => pz.translateScreen(dx, dy))
  }, [updatePanZoom]);

  return (<>
    <Demo<ChartData>
      dimensions={{canvasWidth: width, canvasHeight: height}}
      data={chartData}
      panZoom={panZoom}
      updatePanZoom={updatePanZoom}
      paint={paint}
      onStartDrag={() => true}
      onDrag={onDrag}
      onWheel={(p, deltaY) =>
        updatePanZoom(pz => pz.zoomXAt(p.mx, getZoomFactor(deltaY)))}
    />
  </>)
}