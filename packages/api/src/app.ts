import express from 'express'
import routes from './controllers/index.js'
import compression from 'compression'
import { errorHandler } from './middlewares/errorHandler.js'
import cors from 'cors'
import config from './config.js'
import morgan from 'morgan'
import { sessionMiddleware } from './middlewares/session.js'

const app = express()

app.use(cors({ origin: [config.frontendUrl] }))

app.use(compression())

app.use(express.json())

app.use(morgan(':method :url'))

app.use(sessionMiddleware)

app.use(routes)

app.use(errorHandler)

export default app
