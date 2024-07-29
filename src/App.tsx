import React, {useCallback, useEffect, useRef} from 'react';
import './App.css';
import {Point} from "./PanZoom";
import {StyledCanvas} from "./StyledCanvas";
import {drawRect} from "./misc/Geometry";
import {ConstrainedPanZoom2D} from "./transformation/constrained/ConstrainedPanZoom2D";

const getZoomFactor = (ev: WheelEvent) => Math.pow(10, ev.deltaY / 2000.0);

const canvasCoordinates = (cv: HTMLCanvasElement, ev: MouseEvent): Point => {
  const dpr = 1
  const {left, top} = cv.getBoundingClientRect();
  return { mx: (ev.x - left) * dpr, my: (ev.y - top) * dpr }
}

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pz = useRef(
    new ConstrainedPanZoom2D({ x: 0, y: 0, w: 640, h: 480}, { x: 0, y: 0, w: 1000, h: 1000 })
  )

  const paint = useCallback(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!

    context.resetTransform()
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.setTransform(pz.current.matrix)
    drawRect(context, 0, 0, 100, 100)
    drawRect(context, 900, 0, 100, 100)
    drawRect(context, 400, 400, 100, 100)
    drawRect(context, 0, 900, 100, 100)
    drawRect(context, 900, 900, 100, 100)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!;
    const mouseDownListener = (): void => {
      const dragListener = (ev: MouseEvent) => {
        ev.preventDefault()
        pz.current.translateScreen(ev.movementX, ev.movementY)
        // pz.current = fitIntoScreen(pz.current, screenDimensions, canvasDimensions)
        paint()
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
      paint()
    }
    const wheelListener = (ev: WheelEvent): void => {
      // preventing scrolling
      ev.preventDefault()
      pz.current.zoomAt(canvasCoordinates(canvasRef.current!, ev), getZoomFactor(ev))
      paint()
    }

    canvas.addEventListener('mousedown', mouseDownListener)
    canvas.addEventListener('wheel', wheelListener)
    canvas.addEventListener('mousemove', mouseListener)

    paint()
    return () => {
      canvas.removeEventListener('mousedown', mouseDownListener)
      canvas.removeEventListener('mousemove', mouseListener)
      canvas.removeEventListener('wheel', wheelListener)
    }
  })

  return (
    <div className="App">
      <StyledCanvas width={640} height={480} ref={canvasRef}/>
    </div>
  );
};

export default App;
