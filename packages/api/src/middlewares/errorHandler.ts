import { HTTP_CODES } from '@chords-extractor/common/constants'
import { AppError } from '../errors.js'
import { Request, Response, NextFunction } from 'express'

export function errorHandler (error: Error, _req: Request, res:Response, next: NextFunction) {
  console.error(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'fail',
      errorCode: error.errorCode,
      message: error.message,
      details: error.details
    })
  }

  return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    message: 'Something went wrong'
  })
}
