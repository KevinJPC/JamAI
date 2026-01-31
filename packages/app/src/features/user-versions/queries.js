import { useInfiniteQuery } from '@tanstack/react-query'

import { getUserVersions } from '@/features/user-versions/services/users'
import { userKeys } from '@/shared/queries/userQueries'

export function useUserVersionsInfiniteQuery () {
  return useInfiniteQuery({
    queryKey: userKeys.userVersions(),
    queryFn: ({ pageParam }) => getUserVersions({ continuationToken: pageParam }),
    getNextPageParam: (lastPage, _allPages) => lastPage.nextContinuationToken,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      const results = data.pages.flatMap(page => page.items)
      return {
        results,
        hasResults: !!results.length,
        count: results.length
      }
    }
  })
}
