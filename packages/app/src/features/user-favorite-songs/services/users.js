import { apiClient } from '@/shared/lib/apiClient'

export async function getUserFavoriteSongs ({ continuationToken }) {
  const searchParams = new URLSearchParams()
  if (continuationToken) searchParams.set('continuationToken', continuationToken)

  const result = await apiClient.get('/api/users/me/favorites', { searchParams })

  return result.data.data
}
