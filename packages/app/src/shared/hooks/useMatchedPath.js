import { matchRoute, useRouter } from 'wouter'

import { useLocation } from '@/shared/hooks/useLocation'

function matchPathPattern ({ parser, paths, location }) {
  for (const path of paths) {
    const [matches] = matchRoute(parser, path, location)
    if (matches) return path
  }
  return null
}

export function useMatchedPath (paths) {
  const router = useRouter()
  const [location] = useLocation()
  const matchedPath = matchPathPattern({ parser: router.parser, location, paths })
  return matchedPath
}
