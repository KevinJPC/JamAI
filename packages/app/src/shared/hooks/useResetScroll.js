import { useLayoutEffect } from 'react'

export const useResetScrollOnChange = (deps = []) => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, deps)
}
