import {Point} from "./Geometry";

export class TransformationMatrix implements DOMMatrix2DInit {
  a: number = 1
  b: number = 0
  c: number = 0
  d: number = 1
  e: number = 0
  f: number = 0

  public apply(p: Point): Point {
    return {
      mx: this.a * p.mx + this.c * p.my + this.e,
      my: this.b * p.mx + this.d * p.my + this.f,
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
