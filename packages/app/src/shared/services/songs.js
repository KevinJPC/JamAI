import { apiClient } from '@/shared/lib/apiClient.js'

export const getSongs = async ({ continuationToken }) => {
  const searchParams = new URLSearchParams()
  if (continuationToken) searchParams.set('continuationToken', continuationToken)

  const res = await apiClient.get('/api/songs', { searchParams })

  return res.data.data
}
