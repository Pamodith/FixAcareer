import mongoose from 'mongoose'
import config from '../../config'
import logger from '../../utils/logger'

export const connectDatabase = () => {
  try {
    mongoose.set('strictQuery', false)
    mongoose.connect(config.DB_URL, {
      keepAlive: true,
      socketTimeoutMS: 30000,
    })
    logger.info(`Connected to database successfully`)
  } catch (err) {
    logger.error(`Failed to connect to the database | message: ${err.message}`)
  }

  mongoose.connection.on('error', (err) => logger.error(`Database error - message: ${err.message} - error: ${err.message}`))

  mongoose.connection.on('disconnected', () => logger.error(`Database disconnected`))

  mongoose.connection.on('reconnected', () => logger.info(`Database reconnected`))

  process.on('exit', () => mongoose.disconnect())
}
