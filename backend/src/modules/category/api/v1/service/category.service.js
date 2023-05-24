import { moduleLogger } from '@sliit-foss/module-logger'
import CategoryRepository from '../repository/category.repository'
import AdminRepository from '../../../../admin/api/v1/repository/admin.repository'

const logger = moduleLogger('Category-Service')

const generateCategoryId = async () => {
  const lastCategory = await CategoryRepository.getLastInsertedCategory()
  if (lastCategory) {
    const lastId = lastCategory.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `CAT-${lastIdNumber + 1}`
  } else {
    return 'CAT-1001'
  }
}

const insertCategory = async (category) => {
  category.id = await generateCategoryId()
  category.lastUpdatedBy = category.addedBy
  return await CategoryRepository.insertCategory(category)
    .then(async (result) => {
      const admin = await AdminRepository.getAdminById(category.addedBy)
      const response = {
        _id: result._id,
        id: result.id,
        name: result.name,
        description: result.description,
        isDeleted: result.isDeleted,
        addedBy: `${admin.firstName} ${admin.lastName}`,
        lastUpdatedBy: `${admin.firstName} ${admin.lastName}`,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }
      return response
    })
    .catch((err) => {
      logger.error(`An error occurred when creating category - err: ${err.message}`)
      throw err
    })
}

const getCategories = async () => {
  return await CategoryRepository.getCategories()
    .then(async (result) => {
      const admins = await AdminRepository.getAdmins()
      result.forEach((category) => {
        const addedAdmin = admins.find((admin) => admin._id.toString() === category.addedBy.toString())
        if (addedAdmin) {
          category.addedBy = `${addedAdmin.firstName} ${addedAdmin.lastName}`
        } else {
          category.addedBy = 'Unknown'
        }
        const lastUpdatedAdmin = admins.find((admin) => admin._id.toString() === category.lastUpdatedBy.toString())
        if (lastUpdatedAdmin) {
          category.lastUpdatedBy = `${lastUpdatedAdmin.firstName} ${lastUpdatedAdmin.lastName}`
        } else {
          category.lastUpdatedBy = 'Unknown'
        }
      })
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving categories - err: ${err.message}`)
      throw err
    })
}

const getCategoryById = async (id) => {
  return await CategoryRepository.getCategoryById(id)
    .then((result) => {
      if (!result) {
        throw new Error(`Category with id ${id} not found`)
      }
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving category by id - err: ${err.message}`)
      throw err
    })
}

const updateCategoryById = async (id, category) => {
  const categoryToUpdate = await CategoryRepository.getCategoryById(id)
  if (!categoryToUpdate) {
    throw new Error(`Category not found - id: ${id}`)
  }
  return await CategoryRepository.updateCategoryById(id, category)
    .then(async (result) => {
      const admin = await AdminRepository.getAdminById(category.lastUpdatedBy)
      const response = {
        _id: result._id,
        id: result.id,
        name: result.name,
        description: result.description,
        isDeleted: result.isDeleted,
        addedBy: categoryToUpdate.addedBy,
        lastUpdatedBy: `${admin.firstName} ${admin.lastName}`,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }
      return response
    })
    .catch((err) => {
      logger.error(`An error occurred when updating category by id - err: ${err.message}`)
      throw err
    })
}

const deleteCategoryById = async (id) => {
  return await CategoryRepository.deleteCategoryById(id)
    .then((result) => {
      if (!result) {
        throw new Error(`Category with id ${id} not found`)
      }
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting category by id - err: ${err.message}`)
      throw err
    })
}

const CategoryService = {
  insertCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
}

export default CategoryService
