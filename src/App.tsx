import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {Rectangle, Scene} from "./Scene";
import {PanZoom, Point} from "./PanZoom";
import TransformVisualizer from "./TransformVisualizer";
import {StyledCanvas} from "./StyledCanvas";
const setupScene = () => {
  const scene = new Scene()
  scene.add(new Rectangle(0, 0, 100, 100))
  return scene
}

const App = () => {
  const scene = useRef(setupScene())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pz = useRef(new PanZoom())

  const [matrix, updateMatrix] = useState(pz.current.matrix)
  const [mousePosition, updateMousePosition] = useState<Point>({x: 0, y: 0})
  const [mouseProjectionPosition, updateMouseProjectionPosition] = useState<Point>({x: 0, y: 0})

  const canvasCoordinates = useCallback((ev: MouseEvent): Point => {
    const dpr = 1
    const cv = canvasRef.current!
    const boundingClientRect = cv.getBoundingClientRect();
    const offsetX = boundingClientRect.left
    const offsetY = boundingClientRect.top
    return {x: (ev.x - offsetX) * dpr, y: (ev.y - offsetY) * dpr}
  }, [])

  const updateMouseCoordinates = useCallback((ev: MouseEvent) => {
    const mousePos = canvasCoordinates(ev);
    const mouseProjPos = pz.current.inverse(mousePos)

    updateMousePosition(mousePos)
    updateMouseProjectionPosition(mouseProjPos)
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!

    context.resetTransform()
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.setTransform(pz.current.matrix)
    scene.current.draw(context)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!;
    const mouseDownListener = (ev: MouseEvent): void => {
      const dragListener = (ev: MouseEvent) => {
        ev.preventDefault()
        pz.current.translate(ev.movementX, ev.movementY)
        updateMouseCoordinates(ev);
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
      updateMouseCoordinates(ev);
      paint()
    }
    const wheelListener = (ev: WheelEvent): void => {
      // preventing scrolling
      ev.preventDefault()

      pz.current.zoomAt(canvasCoordinates(ev), ev.deltaY / 100.0)
      updateMatrix(pz.current.matrix)
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
      <TransformVisualizer
        matrix={matrix}
        mousePosition={mousePosition}
        mouseProjectionPosition={mouseProjectionPosition}
      />
    </div>
  );
};

export default App;

