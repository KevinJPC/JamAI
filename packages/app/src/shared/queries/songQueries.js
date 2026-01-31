import { useInfiniteQuery } from '@tanstack/react-query'

import { getSongs } from '@/shared/services/songs'

export const songKeys = {
  all: ['songs'],
  list: () => [...songKeys.all, 'list'],
  detail: (songId) => [...songKeys.all, 'detail', songId],
}

export const useSongsInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: songKeys.list(),
    queryFn: ({ pageParam }) => getSongs({ continuationToken: pageParam }),
    getNextPageParam: (lastPage, _allPages) => {
      return lastPage.nextContinuationToken
    },
    staleTime: 1000 * 60 * 15,
    select: data => {
      return data.pages.flatMap(page => page.items)
    },
  })
}
