import { useEffect } from 'react'

/**
 * This uses a custom temporary element rather than the document element
 * since measuring the document element directly can result in inaccurate results (0px)
 * if the scrollbar is currently hidden.
 */

function measureScrollbarWidth () {
  const temporalScrollBox = document.createElement('div')

  temporalScrollBox.style.overflow = 'scroll'

  document.body.appendChild(temporalScrollBox)

  const scrollBarWidth = temporalScrollBox.offsetWidth - temporalScrollBox.clientWidth

  document.body.removeChild(temporalScrollBox)

  return scrollBarWidth
}

export const useTrackScrollbarWidthCSSProperty = () => {
  useEffect(() => {
    const setScrollbarWidthCSSProperty = () => {
      const scrollbarWidth = measureScrollbarWidth()
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    }
    setScrollbarWidthCSSProperty()
    const observer = new window.ResizeObserver((_entries) => {
      setScrollbarWidthCSSProperty()
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [])
}
