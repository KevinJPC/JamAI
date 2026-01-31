import { useEffect } from 'react'

export const useTrackScrollbarWidthCSSProperty = () => {
  useEffect(() => {
    const setScrollbarWidthCSSProperty = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
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
