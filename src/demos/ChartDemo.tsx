import React, {useCallback, useMemo} from "react";
import {Demo, DemoContext, getZoomFactor} from "../Demo";

export const ChartDemo = () => {
  const { data, dataMin, dataMax } = useMemo(() => {
    let v = 0
    const data: number[] = []

    for (let i = 0; i < 200; i++) {
      v += Math.random() - 0.5
      data.push(v)
    }
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);
    return { data, dataMin, dataMax }
  }, [])

  const paint = useCallback(({canvas, pz}: DemoContext) => {
    const context = canvas.getContext("2d")!
    context.resetTransform()

    context.beginPath()

    let p = pz.apply(0, data[0])
    context.moveTo(p.x, p.y)
    for (let i = 1; i < data.length; i++) {
      p = pz.apply(i, data[i])
      context.lineTo(p.x, p.y)
    }
    context.stroke()
  }, [])

  return (<Demo
    dimensions={{
      canvasWidth: 640,
      canvasHeight: 480,
      scene: {x: 0, y: dataMin, w: data.length - 1, h: (dataMax - dataMin)}
    }}
    paint={paint}
    onWheel={(p, deltaY, {pz}) => pz.tx.zoomAt(p.mx, getZoomFactor(deltaY))}
  />)
}