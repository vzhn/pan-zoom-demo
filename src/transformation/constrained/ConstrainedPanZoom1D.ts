import {PanZoom1D} from "../PanZoom1D";

export interface Constraint {
  screen: { min: number, max: number },
  canvas: { min: number, max: number }
}

export const minScale = (constraint?: Constraint): number => {
  if (!constraint) return 0;

  const canvasWidth = constraint.canvas.max - constraint.canvas.min
  const screenWidth = constraint.screen.max - constraint.screen.min
  return screenWidth / canvasWidth
}

export class ConstrainedPanZoom1D {
  get pz(): PanZoom1D { return this._pz }
  get k() { return this._pz.k }
  get b() { return this._pz.b }

  constructor(private readonly _pz: PanZoom1D = new PanZoom1D(), readonly constraint?: Constraint) {

  }

  public zoomAt(p: number, scale: number, scaleLimit: number = minScale(this.constraint)): ConstrainedPanZoom1D {
    return new ConstrainedPanZoom1D(this._pz.zoomAt(p, scale, scaleLimit), this.constraint).adjustPosition()
  }

  public translateScreen(p: number): ConstrainedPanZoom1D {
    return new ConstrainedPanZoom1D(this._pz.translateScreen(p), this.constraint).adjustPosition()
  }

  apply(p: number): number {
    return this._pz.apply(p)
  }

  setK(k: number): ConstrainedPanZoom1D {
    return new ConstrainedPanZoom1D(this._pz.setK(k), this.constraint).adjustPosition()
  }

  public adjustPosition(): ConstrainedPanZoom1D {
    if (!this.constraint) return this

    const left = this._pz.apply(this.constraint.canvas.min)
    const right = this._pz.apply(this.constraint.canvas.max)

    let transform = this._pz
    if (left > this.constraint.screen.min) {
      transform = transform.translateScreen(this.constraint.screen.min - left)
    }

    if (right < this.constraint.screen.max) {
      transform = transform.translateScreen(this.constraint.screen.max - right)
    }
    return new ConstrainedPanZoom1D(transform, this.constraint)
  }

  public adjustScale(): ConstrainedPanZoom1D {
    const ms = minScale(this.constraint)
    if (this.k < ms) {
      return this.setK(ms)
    } else {
      return this;
    }
  }

  public updateConstraint(c: Constraint): ConstrainedPanZoom1D {
    return new ConstrainedPanZoom1D(this._pz, c)
      .adjustScale()
      .adjustPosition()
  }

  public static forConstraint(c: Constraint) {
    return new ConstrainedPanZoom1D(new PanZoom1D(), c).setK(minScale(c))
  }
}