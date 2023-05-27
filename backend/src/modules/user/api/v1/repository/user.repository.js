import { moduleLogger } from '@sliit-foss/module-logger'
import User from '../models/user.model'

const logger = moduleLogger('User-Repository')

const createUser = async (user) => {
  return await User.create(user)
    .then(async (result) => {
      await result.save()
      logger.info(`User created successfully - id: ${result.id}`)
      delete result._doc.password
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating user - err: ${err.message}`)
      throw err
    })
}

const getUsers = async () => {
  return await User.find({}, { password: 0 })
    .lean()
    .then((result) => {
      if (result) return result
      throw new Error('No users found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving users - err: ${err.message}`)
      throw err
    })
}

const getUserById = async (id) => {
  return await User.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`User not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving user - err: ${err.message}`)
      throw err
    })
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email })
    .lean()
    .then((result) => result)
    .catch((err) => {
      logger.error(`An error occurred when retrieving user - err: ${err.message}`)
      throw err
    })
}

const updateUserById = async (id, updateBody) => {
  return await User.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) {
        delete result.password
        return result
      } else throw new Error(`User not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating user - err: ${err.message}`)
      throw err
    })
}

const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`User not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting user - err: ${err.message}`)
      throw err
    })
}

const getLastInsertedUser = async () => {
  return await User.findOne({}, {}, { sort: { createdAt: -1 } })
    .lean()
    .then((result) => result)
    .catch((err) => {
      logger.error(`An error occurred when retrieving last inserted user - err: ${err.message}`)
      throw err
    })
}

const UserRepository = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getLastInsertedUser,
}

export default UserRepository
