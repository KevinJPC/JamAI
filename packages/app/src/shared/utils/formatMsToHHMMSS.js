const msInAnHour = 60 * 60 * 1000
const msInAMinute = 60 * 1000
const msInASecond = 1000

export function formatMsToHHMMSS (ms) {
  const hours = Math.floor(ms / msInAnHour)
  const minutes = Math.floor((ms - hours * msInAnHour) / msInAMinute)
  const seconds = Math.floor((ms - hours * msInAnHour - minutes * msInAMinute) / msInASecond)

  const filledHours = hours.toString().padStart(2, '0')
  const filledMinutes = minutes.toString().padStart(2, '0')
  const filledSeconds = seconds.toString().padStart(2, '0')

  return `${filledHours}:${filledMinutes}:${filledSeconds}`
}
