import { useQuery } from '@tanstack/react-query'

import { getYoutubeResultsWithSongs } from '@/features/search/services/songs'

const searchKeys = {
  all: ['search'],
  list: ({ q }) => [...searchKeys.all, { q }]
}

export const useYoutubeSearchQuery = ({ q }) => {
  return useQuery({
    queryKey: searchKeys.list({ q }),
    queryFn: () => getYoutubeResultsWithSongs({ q }),
    enabled: !!q,
    staleTime: Infinity,
    retry: false, // to not waste quota xdd,
    select: (data) => {
      return {
        results: data,
        count: data.length,
        hasResults: data.length > 0
      }
    }
  })
}
