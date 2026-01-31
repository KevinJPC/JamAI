import { apiClient } from '@/shared/lib/apiClient'

export async function updateUser ({ name, lastName }) {
  const result = await apiClient.patch('/api/users/me', { name, lastName })
  return result.data.data
}

export async function getMe () {
  const result = await apiClient.get('/api/users/me')
  return result.data.data
}
