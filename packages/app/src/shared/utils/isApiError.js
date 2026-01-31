import { ApiError } from '@/shared/errors'

export function isApiError (error, ...errorCodes) {
  if (!(error instanceof ApiError)) return false
  if (errorCodes && !errorCodes.includes(error.errorCode)) return false
  return true
}
