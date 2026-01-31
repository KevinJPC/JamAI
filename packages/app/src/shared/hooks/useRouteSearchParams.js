import { useCallback, useMemo } from 'react'
import { useRoute, useSearch } from 'wouter'

import { useLocation } from '@/shared/hooks/useLocation'

export const useRouteSearchParams = (pathConfig, { strict = true } = {}) => {
  if (typeof pathConfig !== 'object') throw new Error('Path config object should be passed')
  if (typeof pathConfig.path !== 'string') throw new Error('Path does not have a path template')
  if (typeof pathConfig.searchParser !== 'function') throw new Error('Path does not have a search params parser')
  const [match] = useRoute(pathConfig.path)

  if (!match && strict) throw new Error('Hook is being call outside expected route')

  const [location, navigate] = useLocation()

  const searchString = useSearch()

  const searchParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams(searchString)
    return pathConfig.searchParser(Object.fromEntries(urlSearchParams.entries()))
  }, [searchString, pathConfig])

  const updateSearchParams = useCallback((newSearchParams, options) => {
    const newUrlSearchParams = new URLSearchParams(
      typeof newSearchParams === 'function'
        ? newSearchParams(searchParams)
        : newSearchParams
    )

    const newSearchParamsString = newUrlSearchParams.toString()

    if (searchString === newSearchParamsString) return

    navigate(`${location}?${newSearchParamsString}`, options)
  }, [navigate, searchParams, searchString])
  return [searchParams, updateSearchParams]
}
