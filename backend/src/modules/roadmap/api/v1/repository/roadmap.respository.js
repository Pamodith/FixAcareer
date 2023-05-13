import logger from '../../../../../utils/logger'
import Roadmap from '../models/roadmap.model'

export const createRoadmap = async (roadmap) => {
  return await Roadmap.create(roadmap)
    .then(async (result) => {
      await result.save()
      logger.info(`Roadmap created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating roadmap - err: ${err.message}`)
      throw err
    })
}

export const getRoadmaps = async () => {
  return await Roadmap.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No roadmaps found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving roadmaps - err: ${err.message}`)
      throw err
    })
}

export const getRoadmapById = async (id) => {
  return await Roadmap.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Roadmap not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving roadmap - err: ${err.message}`)
      throw err
    })
}

export const updateRoadmapById = async (id, updateBody) => {
  return await Roadmap.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Roadmap not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating roadmap - err: ${err.message}`)
      throw err
    })
}

export const deleteRoadmapById = async (id) => {
  return await Roadmap.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Roadmap not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting roadmap - err: ${err.message}`)
      throw err
    })
}

const RoadmapRepository = {
  createRoadmap,
  getRoadmaps,
  getRoadmapById,
  updateRoadmapById,
  deleteRoadmapById,
}

export default RoadmapRepository
