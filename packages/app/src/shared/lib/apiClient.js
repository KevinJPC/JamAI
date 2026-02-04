import { backendUrl } from '@/shared/config'
import { ApiFetcher } from '@/shared/utils/ApiFetcher'

let getCsrfTokenPromise = null

function clearCsrfToken () {
  getCsrfTokenPromise = null
}

async function getCsrfToken () {
  if (!getCsrfTokenPromise) {
    getCsrfTokenPromise = apiClient.get('/api/csrf-token').then(res => res.data.token)
  }

  return getCsrfTokenPromise
}

export const apiClient = new ApiFetcher({
  baseUrl: backendUrl,
  beforeRequest: [
    async function ensureCsrfTokenBeforeRequest (config) {
      if (config.options.method === 'GET') return config
      const csrfToken = await getCsrfToken()
      config.options.headers['x-csrf-token'] = csrfToken
      return config
    }
  ],
  afterRequest: [
    // These auth endpoints regenerate or destroy the session (session ID rotation).
    // CSRF tokens are session-scoped, so any existing token becomes invalid after this.
    // Clear the current CSRF token so the client is forced to re-bootstrap it.
    async function clearCsrfTokenAfterSessionRotation (response) {
      if (![
        '/api/auth/local/signin',
        '/api/auth/local/signup',
        '/api/auth/local/signout'
      ].includes(response.endpoint) || !response.ok) return response

      clearCsrfToken()
      return response
    }
  ]
})
