import { HTTP_CODES } from '@chords-extractor/common/constants'
import config from '../config.js'
import { AuthService } from '../services/AuthService.js'
import { Router } from 'express'
import { protectedRouteHandler, routeHandler } from '../utils/routes.js'
import { validateRequest } from '../utils/validateRequest.js'
import { signInInputSchema, signUpInputSchema } from '../schemas/users.js'

const router = Router()

router.post('/signin', routeHandler(
  async function signIn (req, res, next) {
    const input = validateRequest(signInInputSchema, {
      email: req.body.email,
      password: req.body.password
    })
    const user = await AuthService.signIn(input)

    req.session.regenerate((err) => {
      if (err) return next(err)
      req.session.user = { id: user.id.toHexString() }
      req.session.save(function (err) {
        if (err) return next(err)
        res.status(HTTP_CODES.OK).json({
          status: 'success',
          data: user
        })
      })
    })
  }))

router.post('/signup', routeHandler(
  async function signUp (req, res) {
    const input = validateRequest(signUpInputSchema, {
      email: req.body.email,
      name: req.body.name,
      lastName: req.body.lastName,
      password: req.body.password
    })
    const user = await AuthService.signUp(input)
    res.status(HTTP_CODES.CREATED).json(user)
  }))

router.post('/signout', protectedRouteHandler(
  async function logout (req, res) {
    req.session.destroy(() => {})
    res.clearCookie(config.session.cookieName)
    res.status(HTTP_CODES.OK).end()
  }))

export default router
