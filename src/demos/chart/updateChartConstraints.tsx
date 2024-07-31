import {ConstrainedPanZoom2D} from "../../transformation/constrained/ConstrainedPanZoom2D";
import {ChartData} from "./ChartDemo";

export const updateChartConstraints = (
  prevPanZoom: ConstrainedPanZoom2D,
  canvasWidth: number,
  canvasHeight: number,
  chartData: ChartData,
  paddingTop = 0,
  paddingBottom = 0
) => {
  const constraintX = {
    screen: {min: 0, max: canvasWidth},
    canvas: {min: 0, max: chartData.data.length - 1}
  }

  const constraintY = {
    screen: {min: paddingTop, max: canvasHeight - paddingBottom},
    canvas: {min: chartData.dataMin, max: chartData.dataMax}
  }

  return prevPanZoom
    .updateConstraints(constraintX, constraintY)
    .setMinScale(true)
    .adjustPosition()
}