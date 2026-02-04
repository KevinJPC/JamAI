import express from 'express'
import routes from './controllers/index.js'
import compression from 'compression'
import { errorHandler } from './middlewares/errorHandler.js'
import cors from 'cors'
import config from './config.js'
import morgan from 'morgan'
import { sessionMiddleware } from './middlewares/session.js'
import { csrfSynchronisedProtection, generateToken } from './middlewares/csrf.js'

const app = express()

app.use(morgan(':method :url'))

app.use(cors({ origin: [config.frontendUrl], credentials: true, allowedHeaders: ['x-csrf-token'] }))

app.use(compression())

app.use(sessionMiddleware)

app.use(express.json())

app.use('/api/csrf-token', (req, res) => {
  const csrfToken = generateToken(req)
  res.status(200).json({ token: csrfToken })
})

app.use(csrfSynchronisedProtection)

app.use(routes)

app.use(errorHandler)

export default app
