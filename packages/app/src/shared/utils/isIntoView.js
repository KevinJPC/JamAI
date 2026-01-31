export function isIntoView (rect, offsetTop = 0, offsetBottom = 0) {
  const elemTop = Math.floor(rect.top)
  const elemBottom = Math.floor(rect.bottom)

  const viewportTop = 0 - offsetTop
  const viewportBottom = window.innerHeight + offsetBottom

  const isVisible = (elemTop >= viewportTop) && (elemBottom <= viewportBottom)
  return isVisible
}
