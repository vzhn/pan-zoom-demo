export interface Point {
  x: number
  y: number
}

export class TransformationMatrix implements DOMMatrix2DInit {
  a: number = 1
  b: number = 0
  c: number = 0
  d: number = 1
  e: number = 0
  f: number = 0

  public apply(p: Point): Point {
    return {
      x: this.a * p.x + this.c * p.y + this.e,
      y: this.b * p.x + this.d * p.y + this.f,
    }
  }

  public translate(x: number, y: number) {
    this.e += this.a * x + this.c * y
    this.f += this.b * x + this.d * y
  }

  public scale(x: number, y: number) {
    this.a *= x
    this.d *= y
  }

  public inv(): TransformationMatrix {
    const rdet = this.a * this.d - this.b * this.c;
    const m = new TransformationMatrix()
    m.a = this.d /  rdet
    m.b = this.b / -rdet
    m.c = this.c / -rdet
    m.d = this.a /  rdet
    m.e = (this.d * this.e - this.c * this.f) / -rdet
    m.f = (this.b * this.e - this.a * this.f) / rdet
    return m
  }
}

export class PanZoom {
  private _m = new TransformationMatrix()

  transform = (p: Point) => {
    return this.matrix.apply(p)
  }

  inverse = (p: Point) => {
    return this.matrix.inv().apply(p)
  }

  translate = (dx: number, dy: number) => {
    this._m.translate(dx / this._m.a, dy / this._m.d)
  }

  zoomAt = (p: Point, degree: number) => {
    const before = this.inverse(p)
    let factor = Math.exp(0.10 * degree);
    this._m.scale(factor, factor)
    const after = this.inverse(p)

    this._m.translate(after.x - before.x, after.y - before.y)
  }

  public get matrix(): TransformationMatrix {
    return this._m
  }
}