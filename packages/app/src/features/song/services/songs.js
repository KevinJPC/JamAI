import { ERROR_CODES } from '@chords-extractor/common/constants'

import { apiClient } from '@/shared/lib/apiClient.js'
import { isApiError } from '@/shared/utils/isApiError'

export const getSongById = async ({ id }) => {
  try {
    const res = await apiClient.get(`/api/songs/${id}`)
    return res.data.data
  } catch (error) {
    if (isApiError(error, ERROR_CODES.NOT_FOUND)) return null
    throw error
  }
}

export const getSongVersionById = async ({ songId, versionId }) => {
  try {
    const res = await apiClient.get(`/api/songs/${songId}/versions/${versionId}`)
    return res.data.data
  } catch (error) {
    if (isApiError(error, ERROR_CODES.NOT_FOUND)) return null
    throw error
  }
}

export const saveUserSongVersion = async ({ songId, originalVersionId, chords, shiftViewValue, beatsPerBar }) => {
  const result = await apiClient.post(`/api/songs/${songId}/versions`, { originalVersionId, chords, shiftViewValue, beatsPerBar })
  return result.data.data
}

export const deleteUserSongVersion = async ({ songId }) => {
  await apiClient.delete(`/api/songs/${songId}/versions`)
}

export const getSongVersions = async ({ songId, continuationToken }) => {
  const searchParams = new URLSearchParams()
  if (continuationToken) searchParams.set('continuationToken', continuationToken)

  const res = await apiClient.get(`/api/songs/${songId}/versions`, { searchParams })
  return res.data.data
}

export const favoriteSong = async ({ songId }) => {
  const res = await apiClient.post(`/api/songs/${songId}/favorites`)

  return res.data.data
}

export const unfavoriteSong = async ({ songId }) => {
  const res = await apiClient.delete(`/api/songs/${songId}/favorites`)

  return res.data.data
}
