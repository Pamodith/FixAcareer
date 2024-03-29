import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import generator from 'generate-password'
import sha256 from 'crypto-js/sha256'
import { toSuccess, toError } from '../../../../utils'
import AdminEmailService from '../../../../email/admin.emails'
import AdminService from './service/admin.service'

const generatePassword = () => {
  return generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
  })
}

const admin = express.Router()

admin.get(
  '/health',
  tracedAsyncHandler(function healthCheck(_req, res) {
    return toSuccess({ res, message: 'Admin Module Is Up And Running!' })
  }),
)

admin.post(
  '/login',
  tracedAsyncHandler(async function login(req, res) {
    await AdminService.adminLogin(req.body.email, req.body.password)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, status: 401, message: err.message })
      })
  }),
)

admin.post(
  '/refresh-token',
  tracedAsyncHandler(async function refreshToken(req, res) {
    await AdminService.refreshToken(req.body.refreshToken)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.post(
  '/forgot-password',
  tracedAsyncHandler(async function forgotPassword(req, res) {
    await AdminService.forgotPassword(req.body.email)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.post(
  '/',
  tracedAsyncHandler(async function createAdmin(req, res) {
    const password = generatePassword()
    req.body.password = sha256(password).toString()
    await AdminService.insertAdmin(req.body)
      .then(async (data) => {
        await AdminEmailService.sendGeneratedPassord(data, password)
        return toSuccess({ res, status: 201, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.get(
  '/',
  tracedAsyncHandler(async function getAdmins(req, res) {
    await AdminService.getAdmins(req.query)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.get(
  '/:id',
  tracedAsyncHandler(async function getAdminById(req, res) {
    await AdminService.getAdminById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.put(
  '/:id',
  tracedAsyncHandler(async function updateAdminById(req, res) {
    await AdminService.updateAdminById(req.params.id, req.body)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.delete(
  '/:id',
  tracedAsyncHandler(async function deleteAdminById(req, res) {
    await AdminService.deleteAdminById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

admin.get(
  '/:id/verification/status',
  tracedAsyncHandler(async function getTotpStatusById(req, res) {
    await AdminService.getTotpStatusById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, status: 400, message: err.message })
      })
  }),
)

admin.post(
  '/:id/verification',
  tracedAsyncHandler(async function verifyTOTPbyId(req, res) {
    await AdminService.verifyTOTPbyId(req.params.id, req.body.token)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((error) => {
        return toError({ res, status: 400, message: error.message })
      })
  }),
)

admin.post(
  '/:id/verification/choose-method',
  tracedAsyncHandler(async function chooseTOTPMethod(req, res) {
    await AdminService.chooseTOTPMethod(req.params.id, req.body.method)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((error) => {
        return toError({ res, status: 400, message: error.message })
      })
  }),
)

admin.put(
  '/:id/change-password',
  tracedAsyncHandler(async function changePassword(req, res) {
    const password = {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    }
    await AdminService.changePassword(req.params.id, password)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((error) => {
        return toError({ res, status: 400, message: error.message })
      })
  }),
)

export default admin
