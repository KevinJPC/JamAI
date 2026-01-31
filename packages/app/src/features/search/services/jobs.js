import { apiClient } from '@/shared/lib/apiClient.js'

export const createAnalysisJob = async ({ youtubeId }) => {
  const res = await apiClient.post('/api/jobs', { youtubeId })
  return res.data.data
}

export const getAnalysisJob = async ({ id }) => {
  const res = await apiClient.get(`/api/jobs/${id}`)
  return res.data.data
}
