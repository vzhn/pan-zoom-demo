export const createRandomData = (n: number) => {
  let v = 0
  const data: number[] = []

  for (let i = 0; i < n; i++) {
    v += Math.random() - 0.5
    data.push(v)
  }
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  return {data, dataMin, dataMax}
}