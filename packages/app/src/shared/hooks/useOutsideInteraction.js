import { useEffect, useRef } from 'react'

export const useOutsideInteraction = (callback) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event.target, event)
      }
    }

    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('focusin', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('focusin', handleClickOutside, true)
    }
  }, [callback])

  return ref
}
