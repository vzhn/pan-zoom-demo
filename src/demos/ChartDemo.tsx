import React, {useCallback, useMemo, useState} from "react";
import {Demo, DemoContext, getZoomFactor} from "../Demo";
import {drawLines} from "../misc/Geometry";
import {createRandomData} from "../misc/CreateRandomData";
import {PanZoom2D} from "../transformation/PanZoom2D";

export const ChartDemo = () => {
  const [panZoom, updatePanZoom] = useState(new PanZoom2D())

  const { data, dataMin, dataMax } =
    useMemo(() => createRandomData(200), [])

  const paint = useCallback(({canvas, pz}: DemoContext) => {
    const context = canvas.getContext("2d")!
    context.resetTransform()
    drawLines(context, pz, data);
  }, [])

  return (<>
    <Demo
      panZoom={panZoom}
      updatePanZoom={updatePanZoom}
      dimensions={{
        canvasWidth: 640,
        canvasHeight: 480,
        scene: {x: 0, y: dataMin, w: data.length - 1, h: (dataMax - dataMin)}
      }}
      paint={paint}
      onWheel={(p, deltaY, {pz}) => pz.tx.zoomAt(p.mx, getZoomFactor(deltaY))}
    />
    <Demo
      panZoom={panZoom}
      updatePanZoom={updatePanZoom}
      dimensions={{
        canvasWidth: 640,
        canvasHeight: 50,
        scene: {x: 0, y: dataMin, w: data.length - 1, h: (dataMax - dataMin)}
      }}
      paint={paint}
      onWheel={(p, deltaY, {pz}) => pz.tx.zoomAt(p.mx, getZoomFactor(deltaY))}
    />
  </>)
}