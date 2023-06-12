import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { moduleLogger } from '@sliit-foss/module-logger'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import generator from 'generate-password'
import sha256 from 'crypto-js/sha256'
import AdminEmailService from '../../../../../email/admin.emails'
import EncryptionService from '../../../../../encryption/encryption.service'
import AdminRepository from '../repository/admin.repository'
import 'dotenv/config'

const logger = moduleLogger('Admin-Service')

const getTOTPSecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 }).base32
  return EncryptionService.encrypt(secret)
}

const decryptTOTPSecret = (secret) => {
  return EncryptionService.decrypt(secret)
}

const generateTOTP = (secret) => {
  return speakeasy.totp({ secret, encoding: 'base32' })
}

const generateId = async () => {
  const lastInsertedAdmin = await AdminRepository.getLastInsertedAdmin()
  if (lastInsertedAdmin) {
    const lastId = lastInsertedAdmin.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `ADM-${lastIdNumber + 1}`
  } else {
    return 'ADM-1001'
  }
}

const generateQRCode = async (secret) => {
  const otpauthURL = speakeasy.otpauthURL({
    secret,
    label: 'FixACareer',
    issuer: 'FixACareer',
    encoding: 'base32',
  })
  return await QRCode.toDataURL(otpauthURL)
}

const verifyTOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 5,
  })
}

const checkIfEmailExists = async (email) => {
  const admin = await AdminRepository.getAdminByEmail(email)
  if (admin) {
    return true
  } else {
    return false
  }
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = (admin) => {
  const payload = {
    id: admin._id,
    email: admin.email,
    role: 'admin',
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const generateRefreshToken = (admin) => {
  const payload = {
    id: admin._id,
    email: admin.email,
    role: 'admin',
  }
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const generatePassword = () => {
  return generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    excludeSimilarCharacters: true,
  })
}

const insertAdmin = async (admin) => {
  if (await checkIfEmailExists(admin.email)) {
    throw new Error(`Email already exists - email: ${admin.email}`)
  }
  const id = await generateId()
  const hashedPassword = await hashPassword(admin.password)
  const secret = getTOTPSecret()
  const newAdmin = {
    id,
    ...admin,
    password: hashedPassword,
    lastUpdatedBy: admin.addedBy,
    secret,
  }
  return await AdminRepository.insertAdmin(newAdmin)
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when inserting admin - err: ${err.message}`)
      throw err
    })
}

const getAdmins = async () => {
  return await AdminRepository.getAdmins()
    .then((data) => {
      return data
    })
    .catch((err) => {
      logger.error(`An error occurred when getting admins - err: ${err.message}`)
      throw err
    })
}

const getAdminById = async (id) => {
  return await AdminRepository.getAdminById(id)
    .then((data) => {
      return data
    })
    .catch((err) => {
      logger.error(`An error occurred when getting admin by id - err: ${err.message}`)
      throw err
    })
}

const updateAdminById = async (id, admin) => {
  const adminToUpdate = await AdminRepository.getAdminById(id)
  if (!adminToUpdate) {
    throw new Error(`Admin not found - id: ${id}`)
  }
  if (adminToUpdate.email !== admin.email && (await checkIfEmailExists(admin.email))) {
    throw new Error(`Email already exists - email: ${admin.email}`)
  }
  const updatedAdmin = {
    firstName: admin.firstName,
    lastName: admin.lastName,
    gender: admin.gender,
    email: admin.email,
    phone: admin.phone,
    lastUpdatedBy: admin.lastUpdatedBy,
  }
  return await AdminRepository.updateAdminById(id, updatedAdmin)
    .then((data) => {
      return data
    })
    .catch((err) => {
      logger.error(`An error occurred when updating admin by id - err: ${err.message}`)
      throw err
    })
}

const deleteAdminById = async (id) => {
  return await AdminRepository.deleteAdminById(id)
    .then((data) => {
      return data
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting admin by id - err: ${err.message}`)
      throw err
    })
}

const adminLogin = async (email, password) => {
  const admin = await AdminRepository.getAdminByEmail(email)
  if (!admin) {
    throw new Error('Invalid email or password')
  }
  const isMatch = await comparePassword(password, admin.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }
  const response = {
    _id: admin._id,
    id: admin.id,
    email: admin.email,
    isFirstLogin: admin.isFirstLogin,
  }
  return response
}

const refreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
  const admin = await AdminRepository.getAdminById(decoded.id)
  if (!admin) {
    throw new Error('Invalid refresh token')
  }
  const accessToken = generateToken(admin)
  const newRefreshToken = generateRefreshToken(admin)
  const response = {
    accessToken,
    refreshToken: newRefreshToken,
  }
  return response
}

const getTotpStatusById = async (id) => {
  const admin = await AdminRepository.getAdminById(id)
  if (admin) {
    if (admin.isFirstLogin) {
      return { isFirstTime: true }
    } else {
      if (admin.choosenOTPMethod === 'email') {
        AdminEmailService.sendOTP(admin, generateTOTP(decryptTOTPSecret(admin.secret)))
      }
      return { isFirstTime: false, choosenOTPMethod: admin.choosenOTPMethod }
    }
  } else {
    throw new Error('Invalid admin id')
  }
}

const verifyTOTPbyId = async (id, token) => {
  const admin = await AdminRepository.getAdminById(id)
  if (admin) {
    const verified = verifyTOTP(decryptTOTPSecret(admin.secret), token)
    if (verified) {
      const accessToken = generateToken(admin)
      const refreshToken = generateRefreshToken(admin)
      const response = {
        _id: admin._id,
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        gender: admin.gender,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
        isFirstLogin: admin.isFirstLogin,
        accessToken,
        refreshToken,
        isTOTPVerified: true,
      }
      return response
    } else {
      throw new Error('Invalid token')
    }
  } else {
    throw new Error('Invalid admin id')
  }
}

const chooseTOTPMethod = async (id, method) => {
  const admin = {
    choosenOTPMethod: method,
    lastUpdatedBy: id,
    isFirstLogin: false,
  }
  return await AdminRepository.updateAdminById(id, admin)
    .then(async (data) => {
      const secretDecrypted = decryptTOTPSecret(data.secret)
      if (method === 'email') {
        AdminEmailService.sendOTP(data, generateTOTP(secretDecrypted))
        return { choosenMethod: method }
      } else if (method === 'app') {
        const qrCode = await generateQRCode(secretDecrypted)
        return { qrCode: qrCode, choosenMethod: method }
      }
    })
    .catch((err) => {
      logger.error(`An error occurred when updating admin by id - err: ${err.message}`)
      throw err
    })
}

const changePassword = async (id, password) => {
  const admin = await AdminRepository.getAdminById(id)
  const isMatch = await comparePassword(password.currentPassword, admin.password)
  if (isMatch) {
    const hashedPassword = await hashPassword(password.newPassword)
    const updatedAdmin = {
      password: hashedPassword,
    }
    return await AdminRepository.updateAdminById(id, updatedAdmin)
      .then((data) => {
        return data
      })
      .catch((err) => {
        logger.error(`An error occurred when updating admin by id - err: ${err.message}`)
        throw err
      })
  } else {
    throw new Error('Invalid current password')
  }
}

const forgotPassword = async (email) => {
  const admin = await AdminRepository.getAdminByEmail(email)
  if (!admin) {
    throw new Error('No admin found with the given email')
  }
  const newPassword = generatePassword()
  const hashedPassword = await hashPassword(sha256(newPassword).toString())
  return await AdminRepository.updateAdminById(admin._id, { password: hashedPassword })
    .then(async (result) => {
      await AdminEmailService.senPasswordResetEmail(admin, newPassword)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when updating admin password - err: ${err.message}`)
      throw err
    })
}

const AdminService = {
  insertAdmin,
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  adminLogin,
  refreshToken,
  getTotpStatusById,
  verifyTOTPbyId,
  chooseTOTPMethod,
  changePassword,
  forgotPassword,
}

export default AdminService
