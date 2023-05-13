import logger from '../../../../../utils/logger'
import Quiz from '../models/quiz.model'

export const createQuiz = async (quiz) => {
  return await Quiz.create(quiz)
    .then(async (result) => {
      await result.save()
      logger.info(`Quiz created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating quiz - err: ${err.message}`)
      throw err
    })
}

export const getQuizzes = async () => {
  return await Quiz.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No quizzes found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving quizzes - err: ${err.message}`)
      throw err
    })
}

export const getQuizById = async (id) => {
  return await Quiz.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Quiz not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving quiz - err: ${err.message}`)
      throw err
    })
}

export const updateQuizById = async (id, updateBody) => {
  return await Quiz.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Quiz not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating quiz - err: ${err.message}`)
      throw err
    })
}

const QuizRepository = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizById,
}

export default QuizRepository
