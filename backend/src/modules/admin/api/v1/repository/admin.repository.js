import { moduleLogger } from '@sliit-foss/module-logger'
import Admin from '../models/admin.model'

const logger = moduleLogger('Admin-Repository')

const insertAdmin = async (admin) => {
  return await Admin.create(admin)
    .then(async (result) => {
      await result.save()
      logger.info(`Admin created successfully - id: ${result.id}`)
      delete result._doc.password
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating admin - err: ${err.message}`)
      throw err
    })
}

const getAdmins = async () => {
  return await Admin.find({}, { password: 0 })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No admins found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving admins - err: ${err.message}`)
      throw err
    })
}

const getAdminById = async (id) => {
  return await Admin.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Admin not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving admin - err: ${err.message}`)
      throw err
    })
}

const getAdminByEmail = async (email) => {
  return await Admin.findOne({ email })
    .lean()
    .then((result) => result)
    .catch((err) => {
      logger.error(`An error occurred when retrieving admin - err: ${err.message}`)
      throw err
    })
}

const updateAdminById = async (id, updateBody) => {
  return await Admin.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) {
        delete result.password
        return result
      } else {
        throw new Error(`Admin not found - id: ${id}`)
      }
    })
    .catch((err) => {
      logger.error(`An error occurred when updating admin - err: ${err.message}`)
      throw err
    })
}

const deleteAdminById = async (id) => {
  return await Admin.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) {
        delete result.password
        return result
      } else throw new Error(`Admin not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting admin - err: ${err.message}`)
      throw err
    })
}

const getPermissionsByAdminId = async (id) => {
  return await Admin.findById(id)
    .lean()
    .then((result) => {
      if (result) return result.permissions
      else throw new Error(`Admin not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving admin - err: ${err.message}`)
      throw err
    })
}

const updatePermissionsByAdminId = async (id, permissions) => {
  return await Admin.findById(id)
    .lean()
    .then(async (result) => {
      if (result) {
        result.permissions = permissions
        await result.save()
        return result
      } else throw new Error(`Admin not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving admin - err: ${err.message}`)
      throw err
    })
}

const getLastInsertedAdmin = async () => {
  return await Admin.findOne()
    .sort({ _id: -1 })
    .limit(1)
    .lean()
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving admin - err: ${err.message}`)
      throw err
    })
}

const AdminRepository = {
  insertAdmin,
  getAdmins,
  getAdminById,
  getAdminByEmail,
  updateAdminById,
  deleteAdminById,
  getPermissionsByAdminId,
  updatePermissionsByAdminId,
  getLastInsertedAdmin,
}

export default AdminRepository
