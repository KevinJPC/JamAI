import { useCallback, useEffect, useState } from 'react'

export const useIntersectionObserver = ({ onIntersect }) => {
  const [observableEl, setObservableEl] = useState(null)
  const setRefCb = useCallback((node) => {
    if (node) {
      setObservableEl(node)
    }
  }, [])

  useEffect(() => {
    const observer = new window.IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        onIntersect?.()
      }
    }, {
      rootMargin: '1px'
    })
    const observable = observableEl
    if (observable) observer.observe(observable)
    return () => {
      observer.disconnect()
    }
  }, [onIntersect, observableEl])

  return setRefCb
}
