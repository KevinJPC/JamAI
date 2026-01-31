import { useCallback } from 'react'
import { useLocation as useWouterLocation } from 'wouter'

export function useLocation () {
  const [location, navigate] = useWouterLocation()
  const navigateWithScrollPrevention = useCallback(
    (to, { replace, state, transition, preventScrollToTop = false } = {}) => {
      navigate(to, {
        replace,
        state: {
          ...state,
          preventScrollToTop
        },
        transition
      })
    }, [navigate]
  )

  return [location, navigateWithScrollPrevention]
}
