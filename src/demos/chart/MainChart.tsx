import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import React, {useCallback, useEffect} from "react";
import {Demo, DemoContext, getZoomFactor} from "../../Demo";
import {ChartData} from "./ChartDemo";
import {updateChartConstraints} from "./updateChartConstraints";

export const MainChart = ({chartData, width, height, panZoom, paint, updatePanZoom}: {
  chartData: ChartData,
  width: number,
  height: number,
  panZoom: ConstrainedPanZoom2D,
  updatePanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
  paint: (context: DemoContext, data: ChartData) => void
}) => {
  useEffect(() => {
    updatePanZoom((prevPanZoom) =>
      updateChartConstraints(prevPanZoom, width, height, chartData, 10, 10))
  }, [chartData]);

  const onDrag = useCallback(({dx, dy}: { dx: number, dy: number }) => {
    updatePanZoom(pz => pz.translateScreen(dx, dy))
  }, []);
  return (<>
    <Demo<ChartData>
      dimensions={{canvasWidth: width, canvasHeight: height}}
      data={chartData}
      panZoom={panZoom}
      updatePanZoom={updatePanZoom}
      paint={paint}
      onStartDrag={() => true}
      onDrag={onDrag}
      onWheel={(p, deltaY, {pz}) => {
        updatePanZoom(pz.zoomXAt(p.mx, getZoomFactor(deltaY)))
      }}
    />
  </>)
}