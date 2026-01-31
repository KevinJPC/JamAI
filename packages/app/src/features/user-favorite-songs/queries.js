import { useInfiniteQuery } from '@tanstack/react-query'

import { getUserFavoriteSongs } from '@/features/user-favorite-songs/services/users'
import { userKeys } from '@/shared/queries/userQueries'

export function useUserFavoriteSongsInfiniteQuery () {
  return useInfiniteQuery({
    queryKey: userKeys.favoriteSongs(),
    queryFn: ({ pageParam }) => getUserFavoriteSongs({ continuationToken: pageParam }),
    getNextPageParam: (lastPage, _allPages) => lastPage.nextContinuationToken,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      const results = data.pages.flatMap(p => p.items)
      return {
        results,
        hasResults: !!results.length,
        count: results.length
      }
    }
  })
}
