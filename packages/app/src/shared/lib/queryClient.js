import { toast } from 'react-toastify'
import { ERROR_CODES, HTTP_CODES } from '@chords-extractor/common/constants'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

import { handleUnauthorized } from '@/shared/auth/AuthProvider.jsx'
import { formatMsToHHMMSS } from '@/shared/utils/formatMsToHHMMSS'
import { isApiError } from '@/shared/utils/isApiError'

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isApiError(error, ERROR_CODES.FORBIDDEN)) {
        handleUnauthorized()
      }
      if (isApiError(error, ERROR_CODES.TOO_MANY_REQUESTS)) {
        toast.error(`Slow down, try again in ${formatMsToHHMMSS(error.retryAfterMs)}`, { containerId: 'general' })
      }
    }
  }),
  queryCache: new QueryCache({

    onError: (error, query) => {
      if (isApiError(error, ERROR_CODES.FORBIDDEN)) {
        handleUnauthorized()
      }

      if (isApiError(error, ERROR_CODES.TOO_MANY_REQUESTS)) {
        toast.error(`Slow down, try again in ${formatMsToHHMMSS(error.retryAfterMs)}`, { containerId: 'general' })
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

  }
})
