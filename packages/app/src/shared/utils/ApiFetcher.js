import { ApiError } from '@/shared/errors'

export class ApiFetcher {
  baseUrl
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async #fetch (endpoint, options = {}) {
    const endpointWithSearchParams = options.searchParams ? `${endpoint}?${options.searchParams.toString()}` : endpoint
    const url = this.baseUrl ? new URL(endpointWithSearchParams, this.baseUrl) : endpointWithSearchParams
    const res = await fetch(url, {
      method: options.method,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers
      }

    })
    if (!res.ok) {
      const errorData = await res.json().catch(() => null)
      const error = new ApiError({
        originalResponse: res,
        statusCode: res.status,
        errorCode: errorData?.errorCode,
        message: errorData?.message,
        retryAfterMs: errorData?.retryAfterMs
      })
      throw error
    }

    let data = null

    if (res.headers.get('Content-Type')?.includes('application/json')) {
      data = await res.json()
    }

    return { ...res, data }
  }

  async get (endpoint, options = {}) {
    return await this.#fetch(endpoint, { ...options, method: 'GET' })
  }

  async post (endpoint, data, options = {}) {
    return await this.#fetch(endpoint, { ...options, method: 'POST', body: data })
  }

  async patch (endpoint, data, options = {}) {
    return await this.#fetch(endpoint, { ...options, method: 'PATCH', body: data })
  }

  async delete (endpoint, options = {}) {
    return await this.#fetch(endpoint, { ...options, method: 'DELETE' })
  }
}
