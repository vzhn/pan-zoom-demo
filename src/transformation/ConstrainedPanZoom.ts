import {PanZoom2D} from "./PanZoom2D";
import {Point, TransformationMatrix} from "../PanZoom";

export interface Rect { x: number, y: number, w: number, h: number }

const rectRight = (r: Rect) => r.x + r.w
const rectBottom = (r: Rect) => r.y + r.h

export class ConstrainedPanZoom {
  constructor(
    private pz: PanZoom2D,
    private readonly screenLimits: Rect,
    private readonly canvasLimits: Rect
  ) {

  }

  public zoomAt(p: Point, scale: number): void {
    const minScaleX = this.screenLimits.w / this.canvasLimits.w
    const minScaleY = this.screenLimits.h / this.canvasLimits.h

    let {tx, ty} = this.pz;
    if (scale * tx.k < minScaleX) scale = minScaleX / tx.k
    if (scale * ty.k < minScaleY) scale = minScaleY / ty.k

    this.pz = this.pz.zoomAt(p, scale)
    this.fitOnTheScreen()
  }

  public translateScreen(tx: number, ty: number): void {
    this.pz = this.pz.translateScreen(tx, ty)
    this.fitOnTheScreen()
  }

  private fitOnTheScreen() {
    let {tx, ty} = this.pz;

    const left = tx.apply(this.canvasLimits.x)
    const right = tx.apply(rectRight(this.canvasLimits))

    const top = ty.apply(this.canvasLimits.y)
    const bottom = ty.apply(rectBottom(this.canvasLimits))

    if (left > this.screenLimits.x) {
      this.pz = this.pz.translateScreen(this.screenLimits.x - left, 0)
    }
    if (right < rectRight(this.screenLimits)) {
      this.pz = this.pz.translateScreen(rectRight(this.screenLimits) - right, 0)
    }
    if (top > this.screenLimits.y) {
      this.pz = this.pz.translateScreen(0, this.screenLimits.y - top)
    }
    if (bottom < rectBottom(this.screenLimits)) {
      this.pz = this.pz.translateScreen(0, rectBottom(this.screenLimits) - bottom)
    }
  }

  public get matrix(): TransformationMatrix {
    return this.pz.matrix
  }
}