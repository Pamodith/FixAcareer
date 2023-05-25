import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import { toSuccess, toError } from '../../../../utils'
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
  tracedAsyncHandler(async function insertJob(req, res) {
    await JobService.insertJob(req.body)
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
  tracedAsyncHandler(async function updateJobById(req, res) {
    await JobService.updateJobById(req.params.id, req.body)
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

export default job
