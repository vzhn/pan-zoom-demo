export type ChartData = {
  data: number[]
  dataMin: number,
  dataMax: number
}
export type MinimapData = ChartData & { leftX: number, rightX: number }