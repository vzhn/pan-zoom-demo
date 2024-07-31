import React, {useCallback, useEffect, useRef} from 'react';
import './App.css';
import {Point} from "./PanZoom";
import {StyledCanvas} from "./StyledCanvas";
import {ConstrainedPanZoom2D} from "./transformation/constrained/ConstrainedPanZoom2D";

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

export type DemoProps<Data> = {
  dimensions: {
    canvasWidth: number,
    canvasHeight: number,
  },
  data: Data,
  paint: (context: DemoContext, data: Data) => void,
  panZoom: ConstrainedPanZoom2D,
  updatePanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
  onWheel: (screenPoint: Point, deltaY: number, context: DemoContext) => void,

  onStartDrag?: (screenPoint: Point, context: DemoContext) => boolean
  onDrag?: (move: { dx: number, dy: number}) => void
  onStopDrag?: () => void
};

export const  Demo = <Data,>({
  data, dimensions, paint, onWheel, panZoom, updatePanZoom, onStartDrag, onDrag, onStopDrag
}: DemoProps<Data>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const getDemoContext = useCallback(
    () => ({canvas: canvasRef.current!, pz: panZoom}), [panZoom])

  const repaint = useCallback(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext("2d")!
    context.resetTransform()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(panZoom.matrix)

    paint(getDemoContext(), data)
  }, [data, panZoom])

  useEffect(() => repaint(), [data, panZoom]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const mouseDownListener = (ev: MouseEvent): void => {
      if (onStartDrag) {
        if (onStartDrag(canvasCoordinates(canvasRef.current!, ev), getDemoContext())) {
          const dragListener = (ev: MouseEvent) => {
            ev.preventDefault()
            if (onDrag) {
              onDrag({dx: ev.movementX, dy: ev.movementY})
            }
          };

          window.addEventListener('mousemove', dragListener)
          window.addEventListener('mouseup', () => {
            if (onStopDrag) {
              onStopDrag()
            }
            window.removeEventListener('mousemove', dragListener);
          }, { once: true })
        }
      }
    }
    const mouseListener = (ev: MouseEvent): void => {
      // preventing text selection
      ev.preventDefault()
    }
    const wheelListener = (ev: WheelEvent): void => {
      // preventing scrolling
      ev.preventDefault()
      onWheel(canvasCoordinates(canvasRef.current!, ev), ev.deltaY, getDemoContext())
    }

    canvas.addEventListener('mousedown', mouseDownListener)
    canvas.addEventListener('wheel', wheelListener, { passive: false, capture: true })
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
