import { Request, Response, NextFunction, RequestHandler } from 'express'
import { Session, SessionData } from 'express-session'
import { ForbiddenError } from '../errors.js'

export type AuthenticatedRequest = Request & { session: Session & Partial<SessionData> & { user: Required<SessionData['user']> } }

export function routeHandler (cb: (req: Request, res: Response, next: NextFunction) => void): RequestHandler {
  return async (req: Request, res:Response, next: NextFunction) => {
    try {
      return await cb(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export function protectedRouteHandler (cb: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void): RequestHandler {
  return async (req: Request, res:Response, next: NextFunction) => {
    try {
      if (!req.session) throw new Error('express-session middleware should be placed before a protected route handler')
      if (!req.session.user) throw new ForbiddenError()
      return await cb(req as AuthenticatedRequest, res, next)
    } catch (error) {
      next(error)
    }
  }
}
