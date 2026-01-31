export function getTimeFormated (seconds) {
  const minutes = Math.floor(seconds / 60)
  const leftSeconds = seconds - (minutes * 60) || 0
  return `${minutes}:${leftSeconds.toString().padStart(2, '0')}`
}
