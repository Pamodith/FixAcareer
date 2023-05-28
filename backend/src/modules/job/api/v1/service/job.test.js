import JobRepository from '../repository/job.repository'
import AdminRepository from '../../../../admin/api/v1/repository/admin.repository'
import JobService from './job.service'

jest.mock('../repository/job.repository')
jest.mock('../../../../admin/api/v1/repository/admin.repository')

describe('Job Service', () => {
  beforeEach(() => {
    JobRepository.getLastInsertedJob.mockResolvedValue(null)
    JobRepository.createJob.mockImplementation((job) => {
      const admin = {
        _id: job.addedBy,
        firstName: 'John',
        lastName: 'Doe',
      }
      return Promise.resolve({
        _id: 'job_id',
        id: job.id,
        title: job.title,
        description: job.description,
        category: job.category,
        isDeleted: false,
        addedBy: job.addedBy,
        lastUpdatedBy: job.addedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
    JobRepository.getJobs.mockResolvedValue([
      {
        _id: 'job_id',
        id: 'JOB-1001',
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'job_id',
        id: 'JOB-1002',
        title: 'Job 2',
        description: 'Job 2 Description',
        category: 'Category 2',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    JobRepository.getJobById.mockResolvedValue({
      _id: 'job_id',
      id: 'JOB-1001',
      title: 'Job 1',
      description: 'Job 1 Description',
      category: 'Category 1',
      isDeleted: false,
      addedBy: 'admin_id',
      lastUpdatedBy: 'admin_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    JobRepository.updateJobById.mockImplementation((id, job) => {
      const admin = {
        _id: job.lastUpdatedBy,
        firstName: 'John',
        lastName: 'Doe',
      }
      return Promise.resolve({
        _id: 'job_id',
        id: id,
        title: job.title,
        description: job.description,
        category: job.category,
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: job.lastUpdatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })
    JobRepository.deleteJobById.mockResolvedValue(true)
    AdminRepository.getAdminById.mockResolvedValue({
      _id: 'admin_id',
      firstName: 'John',
      lastName: 'Doe',
    })
    AdminRepository.getAdmins.mockResolvedValue([
      {
        _id: 'admin_id',
        firstName: 'John',
        lastName: 'Doe',
      },
    ])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('insertJob', () => {
    it('should insert a new job', async () => {
      const job = {
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        addedBy: 'admin_id',
      }

      const expectedJob = {
        _id: 'job_id',
        id: 'JOB-1001',
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        isDeleted: false,
        addedBy: 'John Doe',
        lastUpdatedBy: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }

      const result = await JobService.insertJob(job)
      expect(JobRepository.getLastInsertedJob).toHaveBeenCalled()
      expect(JobRepository.createJob).toHaveBeenCalledWith(job)
      expect(AdminRepository.getAdminById).toHaveBeenCalledWith('admin_id')
      expect(result).toEqual(expectedJob)
    })

    it('should insert a new job with default ID if no jobs exist', async () => {
      const job = {
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        addedBy: 'admin_id',
      }
      const existingJob = {
        _id: 'existing_job_id',
        id: 'JOB-1001',
        title: 'Existing Job',
        description: 'Existing Job Description',
        category: 'Category 1',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      JobRepository.getLastInsertedJob.mockResolvedValue(existingJob)

      const expectedJob = {
        _id: 'job_id',
        id: 'JOB-1002',
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        isDeleted: false,
        addedBy: 'John Doe',
        lastUpdatedBy: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }

      const result = await JobService.insertJob(job)
      expect(JobRepository.getLastInsertedJob).toHaveBeenCalled()
      expect(JobRepository.createJob).toHaveBeenCalledWith(job)
      expect(AdminRepository.getAdminById).toHaveBeenCalledWith('admin_id')
      expect(result).toEqual(expectedJob)
    })

    it('should handle errors during job insertion', async () => {
      const job = {
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        addedBy: 'admin_id',
      }
      const errorMessage = 'Failed to create job'
      JobRepository.createJob.mockRejectedValue(new Error(errorMessage))

      await expect(JobService.insertJob(job)).rejects.toThrow(errorMessage)
      expect(JobRepository.getLastInsertedJob).toHaveBeenCalled()
      expect(JobRepository.createJob).toHaveBeenCalledWith(job)
      expect(AdminRepository.getAdminById).not.toHaveBeenCalled()
    })
  })

  describe('getJobs', () => {
    it('should retrieve all jobs', async () => {
      const expectedJobs = [
        {
          _id: 'job_id',
          id: 'JOB-1001',
          title: 'Job 1',
          description: 'Job 1 Description',
          category: 'Category 1',
          isDeleted: false,
          addedBy: 'John Doe',
          lastUpdatedBy: 'John Doe',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          _id: 'job_id',
          id: 'JOB-1002',
          title: 'Job 2',
          description: 'Job 2 Description',
          category: 'Category 2',
          isDeleted: false,
          addedBy: 'John Doe',
          lastUpdatedBy: 'John Doe',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]

      const result = await JobService.getJobs()
      expect(JobRepository.getJobs).toHaveBeenCalled()
      expect(AdminRepository.getAdmins).toHaveBeenCalled()
      expect(result).toEqual(expectedJobs)
    })

    it('should handle errors during job retrieval', async () => {
      const errorMessage = 'Failed to retrieve jobs'
      JobRepository.getJobs.mockRejectedValue(new Error(errorMessage))

      await expect(JobService.getJobs()).rejects.toThrow(errorMessage)
      expect(JobRepository.getJobs).toHaveBeenCalled()
      expect(AdminRepository.getAdmins).not.toHaveBeenCalled()
    })
  })

  describe('getJobById', () => {
    it('should retrieve a job by ID', async () => {
      const jobId = 'JOB-1001'
      const expectedJob = {
        _id: 'job_id',
        id: 'JOB-1001',
        title: 'Job 1',
        description: 'Job 1 Description',
        category: 'Category 1',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }

      const result = await JobService.getJobById(jobId)
      expect(JobRepository.getJobById).toHaveBeenCalledWith(jobId)
      expect(result).toEqual(expectedJob)
    })

    it('should handle errors during job retrieval by ID', async () => {
      const jobId = 'JOB-1001'
      const errorMessage = 'Failed to retrieve job by ID'
      JobRepository.getJobById.mockRejectedValue(new Error(errorMessage))

      await expect(JobService.getJobById(jobId)).rejects.toThrow(errorMessage)
      expect(JobRepository.getJobById).toHaveBeenCalledWith(jobId)
    })
  })

  describe('updateJobById', () => {
    it('should update a job by ID', async () => {
      const jobId = 'JOB-1001'
      const job = {
        title: 'Updated Job',
        description: 'Updated Job Description',
        category: 'Updated Category',
        lastUpdatedBy: 'admin_id',
      }

      const expectedJob = {
        _id: 'job_id',
        id: jobId,
        title: 'Updated Job',
        description: 'Updated Job Description',
        category: 'Updated Category',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }

      const result = await JobService.updateJobById(jobId, job)
      expect(JobRepository.getJobById).toHaveBeenCalledWith(jobId)
      expect(JobRepository.updateJobById).toHaveBeenCalledWith(jobId, job)
      expect(AdminRepository.getAdminById).toHaveBeenCalledWith('admin_id')
      expect(result).toEqual(expectedJob)
    })

    it('should handle errors when job to update is not found', async () => {
      const jobId = 'JOB-1001'
      const job = {
        title: 'Updated Job',
        description: 'Updated Job Description',
        category: 'Updated Category',
        lastUpdatedBy: 'admin_id',
      }
      const errorMessage = 'Job not found - id: JOB-1001'
      JobRepository.getJobById.mockResolvedValue(null)

      await expect(JobService.updateJobById(jobId, job)).rejects.toThrow(errorMessage)
      expect(JobRepository.getJobById).toHaveBeenCalledWith(jobId)
      expect(JobRepository.updateJobById).not.toHaveBeenCalled()
      expect(AdminRepository.getAdminById).not.toHaveBeenCalled()
    })

    it('should handle errors during job update by ID', async () => {
      const jobId = 'JOB-1001'
      const job = {
        title: 'Updated Job',
        description: 'Updated Job Description',
        category: 'Updated Category',
        lastUpdatedBy: 'admin_id',
      }
      const errorMessage = 'Failed to update job'
      JobRepository.updateJobById.mockRejectedValue(new Error(errorMessage))

      await expect(JobService.updateJobById(jobId, job)).rejects.toThrow(errorMessage)
      expect(JobRepository.getJobById).toHaveBeenCalledWith(jobId)
      expect(JobRepository.updateJobById).toHaveBeenCalledWith(jobId, job)
      expect(AdminRepository.getAdminById).not.toHaveBeenCalled()
    })
  })

  describe('deleteJobById', () => {
    it('should delete a job by ID', async () => {
      const jobId = 'JOB-1001'

      const result = await JobService.deleteJobById(jobId)
      expect(JobRepository.deleteJobById).toHaveBeenCalledWith(jobId)
      expect(result).toBe(true)
    })

    it('should handle errors when job to delete is not found', async () => {
      const jobId = 'JOB-1001'
      const errorMessage = 'Job with id JOB-1001 not found'
      JobRepository.deleteJobById.mockResolvedValue(false)

      await expect(JobService.deleteJobById(jobId)).rejects.toThrow(errorMessage)
      expect(JobRepository.deleteJobById).toHaveBeenCalledWith(jobId)
    })

    it('should handle errors during job deletion by ID', async () => {
      const jobId = 'JOB-1001'
      const errorMessage = 'Failed to delete job'
      JobRepository.deleteJobById.mockRejectedValue(new Error(errorMessage))

      await expect(JobService.deleteJobById(jobId)).rejects.toThrow(errorMessage)
      expect(JobRepository.deleteJobById).toHaveBeenCalledWith(jobId)
    })
  })
})
