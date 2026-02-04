import config from '../config.js'
import session from 'express-session'
import sessionStore from '../lib/sessionStore.js'

const isProd = config.env === 'production'

export const sessionMiddleware = session({
  unset: 'destroy',
  store: sessionStore,
  name: config.session.cookieName,
  cookie: {
    maxAge: config.session.expirationMs,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  },
  saveUninitialized: false,
  resave: false,
  rolling: true,
  secret: config.session.secretKey
})
