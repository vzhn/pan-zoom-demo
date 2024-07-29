import {PanZoom2D} from "../PanZoom2D";
import {Point, TransformationMatrix} from "../../PanZoom";
import {ConstrainedPanZoom1D} from "./ConstrainedPanZoom1D";
import {PanZoom1D} from "../PanZoom1D";

export interface Rect { x: number, y: number, w: number, h: number }


export class ConstrainedPanZoom2D {
  private tx: ConstrainedPanZoom1D
  private ty: ConstrainedPanZoom1D

  constructor(screenLimits: Rect, canvasLimits: Rect) {
    this.tx = new ConstrainedPanZoom1D(new PanZoom1D(), {
      screen: { min: screenLimits.x, max: screenLimits.x + screenLimits.w },
      canvas: { min: canvasLimits.x, max: canvasLimits.x + canvasLimits.w }
    })

    this.ty = new ConstrainedPanZoom1D(new PanZoom1D(), {
      screen: { min: screenLimits.y, max: screenLimits.y + screenLimits.h },
      canvas: { min: canvasLimits.y, max: canvasLimits.y + canvasLimits.h }
    })
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
}