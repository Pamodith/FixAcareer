import { moduleLogger } from '@sliit-foss/module-logger'
import QuizSetting from '../models/quizsetting.model'

const logger = moduleLogger('QuizSetting-Repository')

export const createQuizSetting = async (quizsetting) => {
  return await QuizSetting.create(quizsetting)
    .then(async (result) => {
      await result.save()
      logger.info(`QuizSetting created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating quizsetting - err: ${err.message}`)
      throw err
    })
}

export const getQuizSettings = async () => {
  return await QuizSetting.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No quizsettings found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving quizsettings - err: ${err.message}`)
      throw err
    })
}

export const getQuizSettingById = async (id) => {
  return await QuizSetting.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`QuizSetting not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving quizsetting - err: ${err.message}`)
      throw err
    })
}

export const updateQuizSettingById = async (id, updateBody) => {
  return await QuizSetting.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`QuizSetting not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating quizsetting - err: ${err.message}`)
      throw err
    })
}
export const deleteQuizSettingById = async (id) => {
  return await QuizSetting.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`QuizSetting not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting quizsetting - err: ${err.message}`)
      throw err
    })
}

const QuizSettingRepository = {
  createQuizSetting,
  getQuizSettings,
  getQuizSettingById,
  updateQuizSettingById,
  deleteQuizSettingById,
}

export default QuizSettingRepository
