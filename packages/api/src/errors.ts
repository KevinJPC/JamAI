import { ERROR_CODES, HTTP_CODES } from '@chords-extractor/common/constants'
export class AppError extends Error {
  statusCode
  errorCode
  details
  constructor ({ errorCode, statusCode, message, details }: { errorCode: string, statusCode: number, message: string, details?: Record<string, any> }) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.details = details
  }
}

export function invalidYoutubeIdError () {
  return new AppError({
    statusCode: HTTP_CODES.BAD_REQUEST,
    errorCode: ERROR_CODES.INVALID_YOUTUBE_ID,
    message: 'Invalid YouTube id',
  })
}

export function notFoundError () {
  return new AppError({
    statusCode: HTTP_CODES.NOT_FOUND,
    errorCode: ERROR_CODES.NOT_FOUND,
    message: 'Resource not found',
  })
}

export function youtubeVideoTooLongError () {
  return new AppError({
    statusCode: HTTP_CODES.BAD_REQUEST,
    errorCode: ERROR_CODES.YOUTUBE_VIDEO_TOO_LONG,
    message: 'YouTube video too long',
  })
}

export function forbiddenError () {
  return new AppError({
    statusCode: HTTP_CODES.FORBIDDEN,
    errorCode: ERROR_CODES.FORBIDDEN,
    message: 'You are not allowed to access this resource',
  })
}

export function invalidCredentialsError () {
  return new AppError({
    statusCode: HTTP_CODES.UNAUTHORIZED,
    errorCode: ERROR_CODES.INVALID_CREDENTIALS,
    message: 'Email and/or password is not valid',
  })
}

export function emailAlreadyTakenError () {
  return new AppError({
    statusCode: HTTP_CODES.CONFLICT,
    errorCode: ERROR_CODES.EMAIL_ALREADY_TAKEN,
    message: 'Email is already in use',
  })
}

export function featureUnavailableError () {
  return new AppError({
    statusCode: HTTP_CODES.SERVICE_UNAVAILABLE,
    errorCode: ERROR_CODES.FEATURE_UNAVAILABLE,
    message: 'This feature is currently disabled',
  })
}

export function tooManyRequestsError ({ retryAfterMs }: { retryAfterMs: number }) {
  return new AppError({
    statusCode: HTTP_CODES.TOO_MANY_REQUESTS,
    errorCode: ERROR_CODES.TOO_MANY_REQUESTS,
    message: 'Too many request. Try again later',
    details: {
      retryAfterMs
    }
  })
}

export type ValidationErrorItem = {
  code: string;
  message: string
}

export type ValidationErrors = {
  root?: ValidationErrorItem[],
  fields?: Record<string, ValidationErrorItem[]>
}

export function validationError ({ errors }: { errors: ValidationErrors }) {
  return new AppError({
    statusCode: HTTP_CODES.BAD_REQUEST,
    errorCode: ERROR_CODES.VALIDATION_ERROR,
    message: 'One or more validation errors occurred',
    details: {
      errors
    }
  })
}
