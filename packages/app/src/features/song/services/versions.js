import { apiClient } from '@/shared/lib/apiClient.js'

export const rateVersion = async ({ versionId, rating }) => {
  const res = await apiClient.post(`/api/versions/${versionId}/ratings`, { rating })
  return res.data.data
}
