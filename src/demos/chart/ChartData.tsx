export type ChartData = {
  data: number[]
  dataMin: number,
  dataMax: number
}
export type MiniChartData = ChartData & { leftX: number, rightX: number }