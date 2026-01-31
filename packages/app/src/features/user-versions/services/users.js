import { apiClient } from '@/shared/lib/apiClient'

export async function getUserVersions ({ continuationToken }) {
  const searchParams = new URLSearchParams()
  if (continuationToken) searchParams.set('continuationToken', continuationToken)

  const result = await apiClient.get('/api/users/me/versions', { searchParams })

  return result.data.data
}
