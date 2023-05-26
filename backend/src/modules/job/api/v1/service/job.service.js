import { moduleLogger } from '@sliit-foss/module-logger'
import JobRepository from '../repository/job.repository'
import AdminRepository from '../../../../admin/api/v1/repository/admin.repository'

const logger = moduleLogger('Job-Service')

const generateJobId = async () => {
  const lastJob = await JobRepository.getLastInsertedJob()
  if (lastJob) {
    const lastId = lastJob.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `JOB-${lastIdNumber + 1}`
  } else {
    return 'JOB-1001'
  }
}

const insertJob = async (job) => {
  job.id = await generateJobId()
  job.lastUpdatedBy = job.addedBy
  return await JobRepository.createJob(job)
    .then(async (result) => {
      const admin = await AdminRepository.getAdminById(job.addedBy)
      const response = {
        _id: result._id,
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category,
        isDeleted: result.isDeleted,
        addedBy: `${admin.firstName} ${admin.lastName}`,
        lastUpdatedBy: `${admin.firstName} ${admin.lastName}`,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }
      return response
    })
    .catch((err) => {
      logger.error(`An error occurred when creating job - err: ${err.message}`)
      throw err
    })
}

const getJobs = async () => {
  return await JobRepository.getJobs()
    .then(async (result) => {
      const admins = await AdminRepository.getAdmins()
      result.forEach((job) => {
        const addedAdmin = admins.find((admin) => admin._id.toString() === job.addedBy.toString())
        if (addedAdmin) {
          job.addedBy = `${addedAdmin.firstName} ${addedAdmin.lastName}`
        } else {
          job.addedBy = 'Unknown'
        }
        const lastUpdatedAdmin = admins.find((admin) => admin._id.toString() === job.lastUpdatedBy.toString())
        if (lastUpdatedAdmin) {
          job.lastUpdatedBy = `${lastUpdatedAdmin.firstName} ${lastUpdatedAdmin.lastName}`
        } else {
          job.lastUpdatedBy = 'Unknown'
        }
      })
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving jobs - err: ${err.message}`)
      throw err
    })
}

const getJobById = async (id) => {
  return await JobRepository.getJobById(id)
    .then((result) => {
      if (!result) {
        throw new Error(`Job with id ${id} not found`)
      }
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving job by id - err: ${err.message}`)
      throw err
    })
}

const updateJobById = async (id, job) => {
  const jobToUpdate = await JobRepository.getJobById(id)
  if (!jobToUpdate) {
    throw new Error(`Job not found - id: ${id}`)
  }
  return await JobRepository.updateJobById(id, job)
    .then(async (result) => {
      const admin = await AdminRepository.getAdminById(job.lastUpdatedBy)
      const response = {
        _id: result._id,
        id: result.id,
        title: result.title,
        description: result.description,
        category: result.category,
        isDeleted: result.isDeleted,
        addedBy: jobToUpdate.addedBy,
        lastUpdatedBy: `${admin.firstName} ${admin.lastName}`,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }
      return response
    })
    .catch((err) => {
      logger.error(`An error occurred when updating job by id - err: ${err.message}`)
      throw err
    })
}

const deleteJobById = async (id) => {
  return await JobRepository.deleteJobById(id)
    .then((result) => {
      if (!result) {
        throw new Error(`Job with id ${id} not found`)
      }
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting job by id - err: ${err.message}`)
      throw err
    })
}

const JobService = {
  insertJob,
  getJobs,
  getJobById,
  updateJobById,
  deleteJobById,
}

export default JobService
