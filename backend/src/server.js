import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { defaultLimiter as rateLimiter, errorHandler, responseInterceptor } from './middleware'
import config from './config'
import routes from './routes'
import { connectDatabase } from './database/mongo'
import logger from './utils/logger'

const app = express()

app.use(helmet())

app.use(compression())

app.use(cors())

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ extended: true }))

app.use(`/api`, rateLimiter, routes)

app.use(responseInterceptor)

app.use(errorHandler)

connectDatabase()

app.listen(config.PORT, config.HOST, () => {
  logger.info(`Service listening on ${config.HOST}:${config.PORT}`)
})
