export class PanZoom1D {
  constructor(private _k: number = 1, private _b: number = 0) {

  }

  public apply(v: number): number {
    return this._k * v + this._b
  }

  public scale(sx: number) {
    this._k *= sx
  }

  /** tx is given in canvas coordinates */
  public translate(tx: number) {
    this._b += this._k * tx
  }

  /** ts is given in screen coordinates */
  public translateScreen(ts: number) {
    this.translate(ts / this._k)
  }

  public inv(): PanZoom1D {
    return new PanZoom1D(1 / this._k, -this._b / this._k)
  }

  public zoomAt(m: number, s: number, minScale = 0) {
    let scale = s
    if (scale * this._k < minScale) {
      scale = minScale / this._k
    }

    this._k = scale * this._k;
    this._b = m + scale * (this._b - m);
  }

  public get k() { return this._k }
  public get b() { return this._b }
}