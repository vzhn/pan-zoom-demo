import React, {useCallback, useMemo, useState} from "react";
import {drawRect} from "../misc/Geometry";
import {Demo,  getZoomFactor} from "../Demo";
import {ConstrainedPanZoom2D} from "../transformation/constrained/ConstrainedPanZoom2D";
import {ConstrainedPanZoom1D} from "../transformation/constrained/ConstrainedPanZoom1D";

export interface Rect { x: number, y: number, w: number, h: number }

export const RectanglesDemo = () => {
  const width = 640
  const height = 480

  const data = useMemo(() => {
    return [
      {x: 0, y: 0, w: 100, h: 100},
      {x: 900, y: 0, w: 100, h: 100},
      {x: 400, y: 400, w: 100, h: 100},
      {x: 0, y: 900, w: 100, h: 100},
      {x: 900, y: 900, w: 100, h: 100},
    ]
  }, [])

  const [panZoom, updatePanZoom] =
    useState(new ConstrainedPanZoom2D(
      new ConstrainedPanZoom1D()
        .updateConstraint({ screen: { min: 0, max: width }, canvas: { min: 0, max: 1000 }})
        .adjustScale()
        .adjustPosition(),

      new ConstrainedPanZoom1D()
        .updateConstraint({ screen: { min: 0, max: height }, canvas: { min: 0, max: 1000 }}))
        .adjustScale()
        .adjustPosition()
    )

  const paint = useCallback((ctx: CanvasRenderingContext2D, data: Rect[]) => {
    ctx.setTransform(panZoom.matrix)

    data.forEach(({x, y, w, h}) => drawRect(ctx, x, y, w, h))
  }, [panZoom])

  const onDrag = useCallback(({dx, dy}: { dx: number, dy: number }) => {
    updatePanZoom(pz => pz.translateScreen(dx, dy))
  }, []);

  return (
    <div>
      <h2>Map</h2>
      <Demo
        panZoom={panZoom}
        updatePanZoom={updatePanZoom}
        dimensions={{
          canvasWidth: width,
          canvasHeight: height
        }}
        paint={paint}
        onWheel={(p, deltaY) => updatePanZoom(pz => pz.zoomAt(p, getZoomFactor(deltaY)))}
        onStartDrag={() => true}
        onDrag={onDrag}
        data={data}
      />
    </div>)
}