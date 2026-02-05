import { toast } from 'react-toastify'
import { ERROR_CODES, HTTP_CODES } from '@chords-extractor/common/constants'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { handleUnauthorized } from '@/shared/auth/AuthProvider.jsx'
import { GENERAL_CONTAINER_ID } from '@/shared/toasts/constants'
import { formatMsToHHMMSS } from '@/shared/utils/formatMsToHHMMSS'
import { isApiError } from '@/shared/utils/isApiError'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error)
      if (isApiError(error, ERROR_CODES.FORBIDDEN)) {
        handleUnauthorized()
      }
      if (isApiError(error, ERROR_CODES.TOO_MANY_REQUESTS) && error.details.retryAfterMs) {
        toast.error(`Slow down, try again in ${formatMsToHHMMSS(error.details.retryAfterMs)}`, { containerId: GENERAL_CONTAINER_ID })
      }
    }
  }),
  queryCache: new QueryCache({

    onError: (error, query) => {
      console.error(error)
      if (isApiError(error, ERROR_CODES.FORBIDDEN)) {
        handleUnauthorized()
      }

      if (isApiError(error, ERROR_CODES.TOO_MANY_REQUESTS) && error.details.retryAfterMs) {
        toast.error(`Slow down, try again in ${formatMsToHHMMSS(error.datails.retryAfterMs)}`, { containerId: GENERAL_CONTAINER_ID })
      }
    },

  }),
  defaultOptions: {
    queries: {
      retry: (_, error) => {
        if (!isApiError(error)) return false
        if (!error.statusCode >= 500) return false
        if ([HTTP_CODES.FORBIDDEN, HTTP_CODES.TOO_MANY_REQUESTS, HTTP_CODES.NOT_FOUND].includes(error.statusCode)) return false
      },
      throwOnError: (_error, query) => {
        const noData = query.state.data === undefined
        if (noData) return true
        return false
      }
    },
    mutations: {
      throwOnError: (error) => {
        if (!isApiError(error)) return true
        if (error.errorCode >= 500) return true
        return false
      }
    }

  }
})
