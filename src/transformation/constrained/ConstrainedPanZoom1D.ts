import {PanZoom1D} from "../PanZoom1D";

export interface Constraint {
  screen: { min: number, max: number },
  canvas: { min: number, max: number }
}

export class ConstrainedPanZoom1D {
  get k() { return this._pz.k }
  get b() { return this._pz.b }

  constructor(
    private _pz = new PanZoom1D(),
    private constraint: Constraint) { }

  public get minScale(): number {
    const canvasWidth = this.constraint.canvas.max - this.constraint.canvas.min
    const screenWidth = this.constraint.screen.max - this.constraint.screen.min
    return screenWidth / canvasWidth
  }

  public zoomAt(p: number, scale: number, scaleLimit: number = this.minScale) {
    this._pz.zoomAt(p, scale, scaleLimit)
    this.fitOnTheScreen()
  }

  public translateScreen(p: number) {
    this._pz.translateScreen(p)
    this.fitOnTheScreen()
  }

  private fitOnTheScreen() {
    const left = this._pz.apply(this.constraint.canvas.min)
    const right = this._pz.apply(this.constraint.canvas.max)

    if (left > this.constraint.screen.min) {
      this._pz.translateScreen(this.constraint.screen.min - left)
    }

    if (right < this.constraint.screen.max) {
      this._pz.translateScreen(this.constraint.screen.max - right)
    }
  }
}