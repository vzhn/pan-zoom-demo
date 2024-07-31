import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Demo, DemoContext, getZoomFactor} from "../Demo";
import {drawLines} from "../misc/Geometry";
import {createRandomData} from "../misc/CreateRandomData";
import {ConstrainedPanZoom2D} from "../transformation/constrained/ConstrainedPanZoom2D";
import {ConstrainedPanZoom1D} from "../transformation/constrained/ConstrainedPanZoom1D";

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
  </>)
}

const MainChart = ({chartData, width, height, panZoom, paint, updatePanZoom }: {
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
      dimensions={{ canvasWidth: width, canvasHeight: height }}
      data={chartData}
      panZoom={panZoom}
      updatePanZoom={updatePanZoom}
      paint={paint}
      onStartDrag={() => true }
      onDrag={onDrag}
      onWheel={(p, deltaY, {pz}) => {
        updatePanZoom(pz.zoomXAt(p.mx, getZoomFactor(deltaY)))
      }}
    />
  </>)
}

const MiniChart = ({chartData, width, height, chartPanZoom, paintChart, updateChartPanZoom }: {
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
    const {leftX, rightX} = data

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
      dimensions={{ canvasWidth: width, canvasHeight: height }}
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

const updateChartConstraints = (
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