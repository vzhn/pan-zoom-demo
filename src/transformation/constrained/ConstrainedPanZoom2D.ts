import {Point, TransformationMatrix} from "../../PanZoom";
import {ConstrainedPanZoom1D} from "./ConstrainedPanZoom1D";

export interface Rect { x: number, y: number, w: number, h: number }

export class ConstrainedPanZoom2D {
  readonly tx: ConstrainedPanZoom1D
  readonly ty: ConstrainedPanZoom1D

  constructor(screenLimits: Rect, canvasLimits: Rect) {
    this.tx = new ConstrainedPanZoom1D({
      screen: { min: screenLimits.x, max: screenLimits.x + screenLimits.w },
      canvas: { min: canvasLimits.x, max: canvasLimits.x + canvasLimits.w }
    })

    this.ty = new ConstrainedPanZoom1D({
      screen: { min: screenLimits.y, max: screenLimits.y + screenLimits.h },
      canvas: { min: canvasLimits.y, max: canvasLimits.y + canvasLimits.h }
    })

    const minK = Math.max(this.tx.minScale, this.ty.minScale)
    this.tx.setK(minK)
    this.ty.setK(minK)
  }

  public zoomAt(p: Point, scale: number): void {
    const scaleLimit = Math.max(this.tx.minScale, this.ty.minScale)
    this.tx.zoomAt(p.mx, scale, scaleLimit)
    this.ty.zoomAt(p.my, scale, scaleLimit)
  }

  public translateScreen(tx: number, ty: number): void {
    this.tx.translateScreen(tx)
    this.ty.translateScreen(ty)
  }

  public get matrix(): TransformationMatrix {
    const tm = new TransformationMatrix()
    tm.translate(this.tx.b, this.ty.b)
    tm.scale(this.tx.k, this.ty.k)
    return tm
  }

  apply(x: number, y: number) {
    return { x: this.tx.apply(x), y: this.ty.apply(y) }
  }
}