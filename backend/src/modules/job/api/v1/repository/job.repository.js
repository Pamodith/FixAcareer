import { moduleLogger } from '@sliit-foss/module-logger'
import Job from '../models/job.model'

const logger = moduleLogger('Job-Repository')

const createJob = async (jobObj) => {
  return await Job.create(jobObj)
    .then(async (result) => {
      await result.save()
      logger.info(`Job created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating job - err: ${err.message}`)
      throw err
    })
}

const getJobs = async () => {
  return await Job.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No jobs found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving jobs - err: ${err.message}`)
      throw err
    })
}

const getJobById = async (id) => {
  return await Job.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Job not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving job - err: ${err.message}`)
      throw err
    })
}

const updateJobById = async (id, updateBody) => {
  return await Job.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Job not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating job - err: ${err.message}`)
      throw err
    })
}

const deleteJobById = async (id) => {
  return await Job.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Job not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting job - err: ${err.message}`)
      throw err
    })
}

const getLastInsertedJob = async () => {
  return await Job.findOne({})
    .sort({ _id: -1 })
    .lean()
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving last inserted job - err: ${err.message}`)
      throw err
    })
}

const getJobsByCategory = async (category) => {
  return await Job.find({ category: category })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No jobs found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving jobs - err: ${err.message}`)
      throw err
    })
}

const JobRepository = {
  createJob,
  getJobs,
  getJobById,
  updateJobById,
  deleteJobById,
  getLastInsertedJob,
  getJobsByCategory,
}

export default JobRepository
