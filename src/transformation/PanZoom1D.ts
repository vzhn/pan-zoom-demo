export class PanZoom1D {
  constructor(readonly k: number = 1,  readonly b: number = 0) {

  }

  public apply(v: number): number {
    return this.k * v + this.b
  }

  public scale(sx: number): PanZoom1D {
    return new PanZoom1D(this.k * sx, this.b)
  }

  /** tx is given in canvas coordinates */
  public translate(tx: number): PanZoom1D {
    return new PanZoom1D(this.k, this.k * tx + this.b)
  }

  /** ts is given in screen coordinates */
  public translateScreen(ts: number): PanZoom1D {
    return this.translate(ts / this.k)
  }

  public inv(): PanZoom1D {
    return new PanZoom1D(1 / this.k, -this.b / this.k)
  }

  public zoomAt(v: number, s: number) {
    return new PanZoom1D(s * this.k,  v + s * (this.b - v))
  }
}