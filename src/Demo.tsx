import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import './App.css';
import {Point} from "./PanZoom";
import {StyledCanvas} from "./StyledCanvas";
import {ConstrainedPanZoom2D, Rect} from "./transformation/constrained/ConstrainedPanZoom2D";

export const getZoomFactor = (deltaY: number) => Math.pow(10, deltaY / 2000.0);

const canvasCoordinates = (cv: HTMLCanvasElement, ev: MouseEvent): Point => {
  const dpr = 1
  const { left, top} = cv.getBoundingClientRect();
  return { mx: (ev.x - left) * dpr, my: (ev.y - top) * dpr }
}

export type DemoContext = {
  canvas: HTMLCanvasElement;
  pz: ConstrainedPanZoom2D
}

export type DemoProps = {
  dimensions: {
    canvasWidth: number,
    canvasHeight: number,
    scene: Rect
  },
  paint: (context: DemoContext) => void,
  onWheel: (screenPoint: Point, deltaY: number, context: DemoContext) => void
};

export const Demo = ({dimensions, paint, onWheel}: DemoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pz = useRef(
    new ConstrainedPanZoom2D({ x: 0, y: 0, w: dimensions.canvasWidth, h: dimensions.canvasHeight}, dimensions.scene)
  )

  const getDemoContext = () => ({canvas: canvasRef.current!, pz: pz.current});

  const repaint = useCallback(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!
    context.resetTransform()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(pz.current.matrix)

    paint(getDemoContext())
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!;
    const mouseDownListener = (): void => {
      const dragListener = (ev: MouseEvent) => {
        ev.preventDefault()
        pz.current.translateScreen(ev.movementX, ev.movementY)
        repaint()
      };
      window.addEventListener('mousemove', dragListener)
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousedown', mouseDownListener);
        window.removeEventListener('mousemove', dragListener);
      }, { once: true })
    }
    const mouseListener = (ev: MouseEvent): void => {
      // preventing text selection
      ev.preventDefault()
    }
    const wheelListener = (ev: WheelEvent): void => {
      // preventing scrolling
      ev.preventDefault()
      onWheel(canvasCoordinates(canvasRef.current!, ev), ev.deltaY, getDemoContext())
      repaint()
    }

    canvas.addEventListener('mousedown', mouseDownListener)
    canvas.addEventListener('wheel', wheelListener)
    canvas.addEventListener('mousemove', mouseListener)

    repaint()
    return () => {
      canvas.removeEventListener('mousedown', mouseDownListener)
      canvas.removeEventListener('mousemove', mouseListener)
      canvas.removeEventListener('wheel', wheelListener)
    }
  })

  return (
    <div className="App">
      <StyledCanvas
        width={dimensions.canvasWidth}
        height={dimensions.canvasHeight}
        ref={canvasRef}
      />
    </div>
  );
};

export default Demo;
