export const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  let text = ` (${x}, ${y})`;
  const tm = ctx.measureText(text)
  ctx.fillText(text, x, y + tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent)
  ctx.beginPath()
  ctx.ellipse(x, y, 2, 2, 0, 0, 360)
  ctx.fill()
}

export const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  ctx.strokeRect(x, y, w, h)

  drawDot(ctx, x, y)
  drawDot(ctx, x + w, y + h)
}