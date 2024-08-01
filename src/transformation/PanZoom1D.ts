export class PanZoom1D {
  constructor(
    private readonly _k: number = 1,
    private readonly _b: number = 0
  ) { }

  public apply(v: number): number {
    return this._k * v + this._b
  }

  public scale(sx: number): PanZoom1D {
    return new PanZoom1D(this._k * sx, this._b)
  }

  /** tx is given in canvas coordinates */
  public translate(tx: number) {
    return new PanZoom1D(this._k, this._b + this._k * tx)
  }

  /** ts is given in screen coordinates */
  public translateScreen(ts: number) {
    return this.translate(ts / this._k)
  }

  public inv(): PanZoom1D {
    return new PanZoom1D(1 / this._k, -this._b / this._k)
  }

  public zoomAt(m: number, s: number, minScale = 0) {
    let scale = s
    if (scale * this._k < minScale) {
      scale = minScale / this._k
    }
    return new PanZoom1D(scale * this._k, m + scale * (this._b - m));
  }

  public get k() { return this._k }
  public get b() { return this._b }

  setK(k: number): PanZoom1D {
    return new PanZoom1D(k, this._b)
  }
}