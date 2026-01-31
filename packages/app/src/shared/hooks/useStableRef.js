import { useEffect, useRef } from 'react'

export const useStableRef = (value) => {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
