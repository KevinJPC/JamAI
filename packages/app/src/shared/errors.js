import { flattenZodIssues } from '@chords-extractor/common/utils'

// Base error just to assign the right name to any custom error
export class CustomError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ApiError extends CustomError {
  statusCode
  errorCode
  originalResponse
  details
  constructor ({ originalResponse, statusCode, errorCode, message, details }) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.originalResponse = originalResponse
    this.details = details
  }
}

export class AppError extends CustomError {}

export class NotFoundSignal extends AppError {}

export class SearchParamsValidationError extends AppError {
  constructor (errors) {
    super('Invalid search params')
    this.errors = errors
  }

  static fromZodError (error) {
    return new SearchParamsValidationError(flattenZodIssues(error.issues))
  }
}

export class ParamsValidationError extends AppError {
  constructor (errors) {
    super('Invalid params')
    this.errors = errors
  }

  static fromZodError (error) {
    return new ParamsValidationError(flattenZodIssues(error.issues))
  }
}
