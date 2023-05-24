import { moduleLogger } from '@sliit-foss/module-logger'
import Category from '../models/category.model'

const logger = moduleLogger('Category-Repository')

const insertCategory = async (category) => {
  return await Category.create(category)
    .then(async (result) => {
      await result.save()
      logger.info(`Category created successfully - id: ${result.id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating category - err: ${err.message}`)
      throw err
    })
}

const getCategories = async () => {
  return await Category.find({})
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No categories found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving categories - err: ${err.message}`)
      throw err
    })
}

const getCategoryById = async (id) => {
  return await Category.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Category not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving category - err: ${err.message}`)
      throw err
    })
}

const updateCategoryById = async (id, updateBody) => {
  return await Category.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Category not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating category - err: ${err.message}`)
      throw err
    })
}

const deleteCategoryById = async (id) => {
  return await Category.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Category not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting category - err: ${err.message}`)
      throw err
    })
}

const getLastInsertedCategory = async () => {
  return await Category.findOne({})
    .sort({ createdAt: -1 })
    .lean()
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving category - err: ${err.message}`)
      throw err
    })
}

const CategoryRepository = {
  insertCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getLastInsertedCategory,
}

export default CategoryRepository
