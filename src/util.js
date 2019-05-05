// stackoverflow
export function filterOutliers(someArray = [], elt) {
  if (!someArray.length) return []
  const values = someArray.concat()
  values.sort((a, b) => a.duration - b.duration)

  const q1 = values[Math.floor(values.length / 4)].duration
  const q3 = values[Math.ceil(values.length * (3 / 4))].duration
  const iqr = q3 - q1

  const maxValue = q3 + iqr * 3
  const minValue = q1 - iqr * 3

  const filteredValues = values.filter(x => x.duration < maxValue && x.duration > minValue)

  return filteredValues
}
