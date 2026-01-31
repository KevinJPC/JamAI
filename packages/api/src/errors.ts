import { ERROR_CODES, HTTP_CODES } from '@chords-extractor/common/constants'
export class AppError extends Error {
  statusCode
  errorCode
  constructor (errorCode: string, statusCode: number, message?: string) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
  }
}

const createAppErrorClass = (name: string, errorCode: string, statusCode: number) => {
  return class extends AppError {
    constructor (message?: string) {
      super(errorCode, statusCode, message)
      this.name = name
    }
  }
}

export class TooManyRequests extends AppError {
  retryAfterMs: number
  constructor ({ retryAfterMs }: { retryAfterMs: number }) {
    super(ERROR_CODES.TOO_MANY_REQUESTS, HTTP_CODES.TOO_MANY_REQUESTS, 'Too many request. Try again later')
    this.retryAfterMs = retryAfterMs
  }
}

export const NotFoundError = createAppErrorClass('NotFoundError', ERROR_CODES.NOT_FOUND, HTTP_CODES.NOT_FOUND)
export const InvalidYoutubeIdError = createAppErrorClass('InvalidYoutubeIdError', ERROR_CODES.INVALID_YOUTUBE_ID, HTTP_CODES.BAD_REQUEST)
export const YoutubeVideoTooLongError = createAppErrorClass('YoutubeVideoTooLongError', ERROR_CODES.YOUTUBE_VIDEO_TOO_LONG, HTTP_CODES.BAD_REQUEST)
export const ForbiddenError = createAppErrorClass('ForbiddenError', ERROR_CODES.FORBIDDEN, HTTP_CODES.FORBIDDEN)
export const InvalidCredentialsError = createAppErrorClass('InvalidCredentialsError', ERROR_CODES.INVALID_CREDENTIALS, HTTP_CODES.UNAUTHORIZED)
export const ValidationError = createAppErrorClass('ValidationError', ERROR_CODES.VALIDATION_ERROR, HTTP_CODES.BAD_REQUEST)
export const InvalidSongIdError = createAppErrorClass('InvalidSongIdError', ERROR_CODES.INVALID_SONG_ID_ERROR, HTTP_CODES.BAD_REQUEST)
export const InvalidVersionIdError = createAppErrorClass('InvalidVersionIdError', ERROR_CODES.INVALID_VERSION_ID_ERROR, HTTP_CODES.BAD_REQUEST)
export const EmailAlreadyTaken = createAppErrorClass('EmailAlreadyTaken', ERROR_CODES.EMAIL_ALREADY_TAKEN, HTTP_CODES.BAD_REQUEST)
export const ServiceUnavailable = createAppErrorClass('ServiceUnavailable', ERROR_CODES.SERVICE_UNAVAILABLE, HTTP_CODES.SERVICE_UNAVAILABLE)
