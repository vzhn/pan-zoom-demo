import {PanZoom1D} from "./PanZoom1D";
import {Point, TransformationMatrix} from "../PanZoom";

export class PanZoom2D {
  constructor(
    readonly tx: PanZoom1D = new PanZoom1D(),
    readonly ty: PanZoom1D = new PanZoom1D()
  ) { }

  public apply({x, y}: Point): Point {
    return {x: this.tx.apply(x), y: this.ty.apply(y)}
  }

  public scale(sx: number, sy: number): PanZoom2D {
    return new PanZoom2D(this.tx.scale(sx), this.ty.scale(sy));
  }

  public translate(tx: number, ty: number): PanZoom2D {
    return new PanZoom2D(this.tx.translate(tx), this.ty.translate(ty));
  }

  public translateScreen(tx: number, ty: number): PanZoom2D {
    return new PanZoom2D(this.tx.translateScreen(tx), this.ty.translateScreen(ty));
  }

  public inv(): PanZoom2D {
    return new PanZoom2D(this.tx.inv(), this.ty.inv())
  }

  public zoomAt({x, y}: Point, scale: number): PanZoom2D {
    return new PanZoom2D(
      this.tx.zoomAt(x, scale),
      this.ty.zoomAt(y, scale)
    )
  }

  public get matrix(): TransformationMatrix {
    const tm = new TransformationMatrix()
    tm.translate(this.tx.b, this.ty.b)
    tm.scale(this.tx.k, this.ty.k)
    return tm
  }
}