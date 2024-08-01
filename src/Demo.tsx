import React, {useCallback, useEffect, useRef} from 'react';
import './App.css';
import {Point} from "./PanZoom";
import {StyledCanvas} from "./styled/StyledCanvas";
import {ConstrainedPanZoom2D} from "./transformation/constrained/ConstrainedPanZoom2D";

export const getZoomFactor = (deltaY: number) => Math.pow(10, deltaY / 2000.0);

const canvasCoordinates = (cv: HTMLCanvasElement, ev: MouseEvent): Point => {
  const dpr = 1
  const { left, top} = cv.getBoundingClientRect();
  return { mx: (ev.x - left) * dpr, my: (ev.y - top) * dpr }
}

export type DemoProps<Data> = {
  dimensions: {
    canvasWidth: number,
    canvasHeight: number,
  },
  data: Data,
  paint: (ctx: CanvasRenderingContext2D, data: Data) => void,
  panZoom: ConstrainedPanZoom2D,
  updatePanZoom: React.Dispatch<React.SetStateAction<ConstrainedPanZoom2D>>,
  onWheel: (screenPoint: Point, deltaY: number) => void,

  onStartDrag?: (screenPoint: Point, canvas: HTMLCanvasElement) => boolean
  onDrag?: (move: { dx: number, dy: number}, canvas: HTMLCanvasElement) => void
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

    paint(context, data)
  }, [data, panZoom])

  useEffect(() => repaint(), [data, panZoom]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const mouseDownListener = (ev: MouseEvent): void => {
      if (!onStartDrag) return;

      if (onStartDrag(canvasCoordinates(canvasRef.current!, ev), canvas)) {
        const dragListener = (ev: MouseEvent) => {
          ev.preventDefault()
          if (onDrag) {
            onDrag({dx: ev.movementX, dy: ev.movementY}, canvas)
          }
        };

        window.addEventListener('mousemove', dragListener)
        window.addEventListener('mouseup', () => {
          if (onStopDrag) {
            onStopDrag()
          }
          window.removeEventListener('mousemove', dragListener);
        }, {once: true})
      }
    }

    const wheelListener = (ev: WheelEvent): void => {
      // preventing scrolling
      ev.preventDefault()
      onWheel(canvasCoordinates(canvasRef.current!, ev), ev.deltaY)
    }

    canvas.addEventListener('mousedown', mouseDownListener)
    canvas.addEventListener('wheel', wheelListener, { passive: false, capture: true })

    repaint()
    return () => {
      canvas.removeEventListener('mousedown', mouseDownListener)
      canvas.removeEventListener('wheel', wheelListener, { capture: true })
    }
  }, [data])

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
