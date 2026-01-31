import { apiClient } from '@/shared/lib/apiClient.js'

export const getYoutubeResultsWithSongs = async ({ q }) => {
  const result = await apiClient.get('/api/songs/search/youtube', { searchParams: new URLSearchParams({ q }) })
  return result.data.data
}
