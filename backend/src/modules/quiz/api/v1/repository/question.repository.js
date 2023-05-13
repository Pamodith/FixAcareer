import logger from '../../../../../utils/logger'
import Question from '../models/question.model'

export const createQuestion = async (question) => {
  return await Question.create(question)
    .then(async (result) => {
      await result.save()
      logger.info(`Question created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating question - err: ${err.message}`)
      throw err
    })
}

export const getQuestions = async () => {
  return await Question.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No questions found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving questions - err: ${err.message}`)
      throw err
    })
}

export const getQuestionById = async (id) => {
  return await Question.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Question not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving question - err: ${err.message}`)
      throw err
    })
}

export const updateQuestionById = async (id, updateBody) => {
  return await Question.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Question not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating question - err: ${err.message}`)
      throw err
    })
}

export const deleteQuestionById = async (id) => {
  return await Question.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Question not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting question - err: ${err.message}`)
      throw err
    })
}

const QuestionRepository = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
}

export default QuestionRepository
