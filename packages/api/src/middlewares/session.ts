import config from '../config.js'
import session from 'express-session'
import sessionStore from '../lib/sessionStore.js'

export const sessionMiddleware = session({
  unset: 'destroy',
  store: sessionStore,
  name: config.session.cookieName,
  cookie: {
    maxAge: config.session.expirationMs,
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  },
  saveUninitialized: false,
  resave: false,
  rolling: true,
  secret: config.session.secretKey
})
