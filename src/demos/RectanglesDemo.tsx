import React, {useCallback, useState} from "react";
import {drawRect} from "../misc/Geometry";
import {Demo, DemoContext, getZoomFactor} from "../Demo";
import {PanZoom2D} from "../transformation/PanZoom2D";

export const RectanglesDemo = () => {
  const [panZoom, updatePanZoom] = useState(new PanZoom2D())

  const paint = useCallback(({canvas, pz}: DemoContext) => {
    const context = canvas.getContext("2d")!
    drawRect(context, 0, 0, 100, 100)
    drawRect(context, 900, 0, 100, 100)
    drawRect(context, 400, 400, 100, 100)
    drawRect(context, 0, 900, 100, 100)
    drawRect(context, 900, 900, 100, 100)
  }, [])

  return (<Demo
    panZoom={panZoom}
    updatePanZoom={updatePanZoom}
    dimensions={{
      canvasWidth: 640,
      canvasHeight: 480,
      scene: {x: 0, y: 0, w: 1000, h: 1000}
    }}
    paint={paint}
    onWheel={(p, deltaY, {pz}) => pz.zoomAt(p, getZoomFactor(deltaY))}
  />)
}