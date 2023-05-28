import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { moduleLogger } from '@sliit-foss/module-logger'
import UserEmailService from '../../../../../email/user.email'
import UserRepository from '../repository/user.repository'
import 'dotenv/config'

const logger = moduleLogger('User-Service')

const generateId = async () => {
  const lastInsertedUser = await UserRepository.getLastInsertedUser()
  if (lastInsertedUser) {
    const lastId = lastInsertedUser.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `USR-${lastIdNumber + 1}`
  } else {
    return 'USR-1001'
  }
}

const checkIfEmailExists = async (email) => {
  const user = await UserRepository.getUserByEmail(email)
  if (user) {
    return true
  } else {
    return false
  }
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: 'user',
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const generateRefreshToken = (user) => {
  const payload = {
    _id: user._id,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: 'user',
  }
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

const createUser = async (user) => {
  if (await checkIfEmailExists(user.email)) {
    throw new Error(`Email already exists - email: ${user.email}`)
  }
  const id = await generateId()
  const hashedPassword = await hashPassword(user.password)
  const newUser = {
    id,
    ...user,
    password: hashedPassword,
  }
  return await UserRepository.createUser(newUser)
    .then(async (result) => {
      await UserEmailService.sendWelcomeEmail(user)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when inserting user - err: ${err.message}`)
      throw err
    })
}

const userLogin = async (email, password) => {
  const user = await UserRepository.getUserByEmail(email)
  if (!user) {
    throw new Error('Invalid credentials')
  }
  const isPasswordMatch = await comparePassword(password, user.password)
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials')
  }
  const token = await generateToken(user)
  const refreshToken = await generateRefreshToken(user)
  const userObj = {
    _id: user._id,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isFirstLogin: user.isFirstLogin,
    accessToken: token,
    refreshToken: refreshToken,
  }
  return userObj
}

const getUserById = async (id) => {
  return await UserRepository.getUserById(id)
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when getting user by id - err: ${err.message}`)
      throw err
    })
}

const UserService = {
  createUser,
  userLogin,
  getUserById,
}

export default UserService
