import {ConstrainedPanZoom1D, Constraint, minScale} from "./ConstrainedPanZoom1D";
import {Point} from "../../misc/Geometry";
import {TransformationMatrix} from "../../misc/TransformationMatrix";

export class ConstrainedPanZoom2D {
  constructor(
    readonly tx: ConstrainedPanZoom1D = new ConstrainedPanZoom1D(),
    readonly ty: ConstrainedPanZoom1D = new ConstrainedPanZoom1D()
  ) { }

  public zoomXAt(x: number, scale: number) {
    return new ConstrainedPanZoom2D(this.tx.zoomAt(x, scale), this.ty)
  }

  public zoomAt({mx, my}: Point, scale: number) {
    const scaleLimit = Math.max(minScale(this.tx.constraint), minScale(this.ty.constraint))
    return new ConstrainedPanZoom2D(this.tx.zoomAt(mx, scale, scaleLimit), this.ty.zoomAt(my, scale, scaleLimit))
  }

  apply(x: number, y: number) {
    return { x: this.tx.apply(x), y: this.ty.apply(y) }
  }

  public translateScreen(tx: number, ty: number): ConstrainedPanZoom2D {
    return new ConstrainedPanZoom2D(this.tx.translateScreen(tx), this.ty.translateScreen(ty))
  }

  public get matrix(): TransformationMatrix {
    const tm = new TransformationMatrix()
    tm.translate(this.tx.b, this.ty.b)
    tm.scale(this.tx.k, this.ty.k)
    return tm
  }

  public updateConstraints(cx: Constraint, cy: Constraint) {
    return new ConstrainedPanZoom2D(
      new ConstrainedPanZoom1D(this.tx.pz, cx),
      new ConstrainedPanZoom1D(this.ty.pz, cy)
    )
  }

  public setMinScale(separate = false): ConstrainedPanZoom2D {
    if (separate) {
      const minKx = minScale(this.tx.constraint);
      const minKy = minScale(this.ty.constraint);
      return new ConstrainedPanZoom2D(this.tx.setK(minKx), this.ty.setK(minKy))
    } else {
      const scale = Math.min(minScale(this.tx.constraint), minScale(this.ty.constraint))
      return new ConstrainedPanZoom2D(this.tx.setK(scale), this.ty.setK(scale))
    }
  }

  public adjustScale(separate = false): ConstrainedPanZoom2D {
    if (separate) {
      const minKx = minScale(this.tx.constraint);
      const minKy = minScale(this.ty.constraint);

      const kx = Math.max(this.tx.k, minKx)
      const ky = Math.max(this.ty.k, minKy)
      return new ConstrainedPanZoom2D(this.tx.setK(kx), this.ty.setK(ky))
    } else {
      if (!this.tx.constraint || !this.ty.constraint) return this;

      const maxScale = Math.max(minScale(this.tx.constraint), minScale(this.ty.constraint))
      const kx = Math.max(this.tx.k, maxScale)
      const ky = Math.max(this.ty.k, maxScale)
      return new ConstrainedPanZoom2D(this.tx.setK(kx), this.ty.setK(ky))
    }
  }

  public adjustPosition(): ConstrainedPanZoom2D {
    return new ConstrainedPanZoom2D(
      this.tx.adjustPosition(),
      this.ty.adjustPosition()
    )
  }
}