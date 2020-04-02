// stackoverflow
export function filterOutliers(someArray = []) {
  if (!someArray.length) return []
  const values = someArray.concat()
  values.sort((a, b) => a.duration - b.duration)

  const q1 = values[Math.floor(values.length / 4)].duration
  const q3 =
    values[Math.min(Math.ceil(values.length * (3 / 4)), values.length - 1)]
      .duration
  const iqr = q3 - q1

  const maxValue = q3 + iqr * 3
  const minValue = q1 - iqr * 3

  return values.filter(
    (x) => x.duration < maxValue && x.duration > minValue && !!x.finished_at
  )
}
export function isAbortException(exception) {
  return (
    // DOMException
    exception.name === 'AbortError' ||
    // standard-ish non-DOM abort exception
    exception.code === 'ERR_ABORTED' ||
    // stringified DOMException
    exception.message === 'AbortError: aborted' ||
    // stringified standard-ish exception
    exception.message === 'Error: aborted'
  )
}
