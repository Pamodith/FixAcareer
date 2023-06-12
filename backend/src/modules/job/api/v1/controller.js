import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import formidable from 'formidable'
import { toSuccess, toError } from '../../../../utils'
import ImageService from '../../../../cloudinary/image.service'
import auth from '../../../../middleware/auth'
import JobService from './service/job.service'

const job = express.Router()

job.get(
  '/health',
  tracedAsyncHandler(function healthCheck(_req, res) {
    return toSuccess({ res, message: 'Server up and running!' })
  }),
)

job.post(
  '/',
  auth.adminProtect,
  tracedAsyncHandler(async function insertJob(req, res) {
    const form = formidable({ multiples: true })
    const job = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    if (job.files.image) {
      await ImageService.uploadImage(job.files.image.filepath, 'job')
        .then((data) => {
          job.fields.image = data.secure_url
        })
        .catch((err) => {
          return toError({ res, message: err.message })
        })
    }
    await JobService.insertJob(job.fields)
      .then((data) => {
        return toSuccess({ res, status: 201, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

job.get(
  '/',
  auth.protect,
  tracedAsyncHandler(async function getJobs(_req, res) {
    await JobService.getJobs()
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

job.get(
  '/:id',
  auth.protect,
  tracedAsyncHandler(async function getJobById(req, res) {
    await JobService.getJobById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

job.put(
  '/:id',
  auth.adminProtect,
  tracedAsyncHandler(async function updateJobById(req, res) {
    const form = formidable({ multiples: true })
    const job = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    const jobToUpdate = {
      title: job.fields.title,
      description: job.fields.description,
      category: job.fields.category,
      lastUpdatedBy: job.fields.lastUpdatedBy,
    }
    if (job.files.image) {
      await ImageService.uploadImage(job.files.image.filepath, 'job')
        .then((data) => {
          jobToUpdate.image = data.secure_url
        })
        .catch((err) => {
          return toError({ res, message: err.message })
        })
    }
    await JobService.updateJobById(req.params.id, jobToUpdate)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

job.delete(
  '/:id',
  auth.adminProtect,
  tracedAsyncHandler(async function deleteJobById(req, res) {
    await JobService.deleteJobById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

job.get(
  '/category/:id',
  auth.protect,
  tracedAsyncHandler(async function getJobsByCategoryId(req, res) {
    await JobService.getJobsByCategory(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

export default job
