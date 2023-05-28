import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import AdminEmailService from '../../../../../email/admin.emails'
import EncryptionService from '../../../../../encryption/encryption.service'
import AdminRepository from '../repository/admin.repository'
import AdminService from './admin.service'

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('speakeasy')
jest.mock('qrcode')
jest.mock('../../../../../email/admin.emails')
jest.mock('../../../../../encryption/encryption.service')
jest.mock('../repository/admin.repository')

describe('Admin Service', () => {
  let adminId = ''

  describe('insertAdmin', () => {
    it('should insert a new admin', async () => {
      const admin = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'fixacareer@gmail.com',
        password: 'password123',
        addedBy: 'adminId',
      }

      const generatedId = 'ADM-1002'
      const hashedPassword = 'hashedPassword'
      const encryptedSecret = 'encryptedSecret'

      AdminRepository.getAdminByEmail.mockResolvedValue(null)
      AdminRepository.getLastInsertedAdmin.mockResolvedValue({
        id: 'ADM-1001',
      })
      AdminRepository.insertAdmin.mockResolvedValue({ id: generatedId })

      bcrypt.genSalt.mockResolvedValue('salt')
      bcrypt.hash.mockResolvedValue(hashedPassword)
      speakeasy.generateSecret.mockReturnValue({ base32: 'secret' })
      EncryptionService.encrypt.mockReturnValue(encryptedSecret)

      const result = await AdminService.insertAdmin(admin)
      adminId = result.id

      expect(AdminRepository.getAdminByEmail).toHaveBeenCalledWith(admin.email)
      expect(AdminRepository.getLastInsertedAdmin).toHaveBeenCalled()
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
      expect(bcrypt.hash).toHaveBeenCalledWith(admin.password, 'salt')
      expect(speakeasy.generateSecret).toHaveBeenCalledWith({ length: 20 })
      expect(EncryptionService.encrypt).toHaveBeenCalledWith('secret')
      expect(AdminRepository.insertAdmin).toHaveBeenCalledWith({
        id: generatedId,
        ...admin,
        password: hashedPassword,
        lastUpdatedBy: admin.addedBy,
        secret: encryptedSecret,
      })
      expect(result).toEqual({ id: generatedId })
    })

    it('should throw an error if email already exists', async () => {
      const admin = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'fixacareer@gmail.com',
        password: 'password123',
        addedBy: 'adminId',
      }

      AdminRepository.getAdminByEmail.mockResolvedValue(admin)

      await expect(AdminService.insertAdmin(admin)).rejects.toThrow('Email already exists - email: fixacareer@gmail.com')

      expect(AdminRepository.getAdminByEmail).toHaveBeenCalledWith(admin.email)
      expect(AdminRepository.getLastInsertedAdmin).not.toHaveBeenCalled()
      expect(AdminRepository.insertAdmin).not.toHaveBeenCalled()
    })
  })

  describe('getAdmins', () => {
    it('should get all admins', async () => {
      const admins = [
        { id: 'ADM-1001', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 'ADM-1002', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      ]

      AdminRepository.getAdmins.mockResolvedValue(admins)

      const result = await AdminService.getAdmins()

      expect(AdminRepository.getAdmins).toHaveBeenCalled()
      expect(result).toEqual(admins)
    })
  })

  describe('getAdminById', () => {
    it('should get an admin by ID', async () => {
      const admin = { id: 'ADM-1002', firstName: 'John', lastName: 'Doe', email: 'fixacareer@gmail.com' }

      AdminRepository.getAdminById.mockResolvedValue(admin)

      const result = await AdminService.getAdminById(adminId)

      expect(AdminRepository.getAdminById).toHaveBeenCalledWith(adminId)
      expect(result).toEqual(admin)
    })
  })
})
