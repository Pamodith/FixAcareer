import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import { toSuccess, toError } from '../../../../utils'
import UserService from './service/user.service'

const user = express.Router()

user.get(
  '/health',
  tracedAsyncHandler(function healthCheck(_req, res) {
    return toSuccess({ res, message: 'Server up and running!' })
  }),
)

user.post(
  '/login',
  tracedAsyncHandler(async function login(req, res) {
    const { email, password } = req.body
    await UserService.userLogin(email, password)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, status: 401, message: err.message })
      })
  }),
)

user.post(
  '/register',
  tracedAsyncHandler(async function register(req, res) {
    await UserService.createUser(req.body)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

user.get(
  '/:id',
  tracedAsyncHandler(async function getUserById(req, res) {
    await UserService.getUserById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

export default user
