import { apiClient } from '@/shared/lib/apiClient.js'

export async function signIn ({ email, password }) {
  const result = await apiClient.post('/api/auth/local/signin', { email, password })
  return result.data.data
}

export async function signUp ({ email, name, lastName, password }) {
  const result = await apiClient.post('/api/auth/local/signup', {
    email, name, lastName, password
  })

  return result.data.data
}

export async function signOut () {
  await apiClient.post('/api/auth/local/signout')
}
