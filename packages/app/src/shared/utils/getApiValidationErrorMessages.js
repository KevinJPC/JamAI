import { ERROR_CODES } from '@chords-extractor/common/constants'

import { isApiError } from '@/shared/utils/isApiError'

export function getApiValidationErrorMessages (error, fieldKey) {
  if (!isApiError(error, ERROR_CODES.VALIDATION_ERROR)) return null
  const errors = fieldKey ? error?.details?.errors?.fields?.[fieldKey] : error?.details?.errors?.root
  if (!errors) return null
  return errors.map(({ message }) => message)
}
