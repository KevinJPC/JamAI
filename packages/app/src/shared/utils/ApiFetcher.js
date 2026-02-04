import { ApiError } from '@/shared/errors'

export class ApiFetcher {
  baseUrl
  beforeRequest
  afterRequest

  constructor ({ baseUrl, beforeRequest = [], afterRequest = [] }) {
    this.baseUrl = baseUrl
    this.beforeRequest = beforeRequest
    this.afterRequest = afterRequest
  }

  async #fetch (endpoint, options = {}) {
    let config = {
      endpoint,
      options: {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers
        }
      }
    }

    config = await this.beforeRequest.reduce(async (prevConfig, beforeRequestHook) => {
      return await beforeRequestHook(prevConfig)
    }, config)

    const endpointWithSearchParams = config.options.searchParams ? `${endpoint}?${config.options.searchParams.toString()}` : endpoint
    const url = this.baseUrl ? new URL(endpointWithSearchParams, this.baseUrl) : endpointWithSearchParams
    let res = await fetch(url, {
      method: config.options.method,
      body: config.options.body ? JSON.stringify(config.options.body) : undefined,
      headers: config.options.headers

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
    res.data = data
    res.endpoint = endpoint

    res = await this.afterRequest.reduce(async (prevResponse, afterRequestHook) => {
      return await afterRequestHook(prevResponse)
    }, res)

    return res
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
