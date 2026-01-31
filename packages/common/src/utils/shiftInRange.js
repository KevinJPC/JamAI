// from https://dev.to/timothee/using-modulo-to-shift-a-value-and-keep-it-inside-a-range-8fm
export function shiftInRange ({ value, min, max, offset }) {
  return (value - min + (offset % max) + max) % max + min
}
