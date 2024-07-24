export interface SceneObject {
  draw: (ctx: CanvasRenderingContext2D) => void
}

export class Scene {
  private readonly objects: SceneObject[] = []

  public add(o: SceneObject): void {
    this.objects.push(o)
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.objects.forEach(v => v.draw(ctx))
  }
}

export class Rectangle implements SceneObject {
  constructor(readonly x: number, readonly y: number, readonly w: number, readonly h: number) { }
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeRect(this.x, this.y, this.w, this.h)

    drawDot(ctx, this.x, this.y)
    drawDot(ctx, this.x + this.w, this.y + this.h)
  }
}

const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  let text = ` (${x}, ${y})`;
  const tm = ctx.measureText(text)
  ctx.fillText(text, x, y  + tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent)
  ctx.beginPath()
  ctx.ellipse(x, y, 2, 2, 0, 0, 360)
  ctx.fill()
}