import CategoryRepository from '../repository/category.repository'
import AdminRepository from '../../../../admin/api/v1/repository/admin.repository'
import CategoryService from './category.service'

jest.mock('../repository/category.repository')
jest.mock('../../../../admin/api/v1/repository/admin.repository')

describe('Category Service', () => {
  beforeEach(() => {
    CategoryRepository.getLastInsertedCategory.mockResolvedValue(null)
    CategoryRepository.insertCategory.mockResolvedValue({
      _id: 'category_id',
      id: 'CAT-1001',
      name: 'Category 1',
      description: 'Category 1 Description',
      isDeleted: false,
      addedBy: 'admin_id',
      lastUpdatedBy: 'admin_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    CategoryRepository.getCategories.mockResolvedValue([
      {
        _id: 'category_id',
        id: 'CAT-1001',
        name: 'Category 1',
        description: 'Category 1 Description',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'category_id',
        id: 'CAT-1002',
        name: 'Category 2',
        description: 'Category 2 Description',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    CategoryRepository.getCategoryById.mockResolvedValue({
      _id: 'category_id',
      id: 'CAT-1001',
      name: 'Category 1',
      description: 'Category 1 Description',
      isDeleted: false,
      addedBy: 'admin_id',
      lastUpdatedBy: 'admin_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    CategoryRepository.updateCategoryById.mockResolvedValue({
      _id: 'category_id',
      id: 'CAT-1001',
      name: 'Updated Category',
      description: 'Updated Category Description',
      isDeleted: false,
      addedBy: 'admin_id',
      lastUpdatedBy: 'admin_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    CategoryRepository.deleteCategoryById.mockResolvedValue(true)
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

  describe('insertCategory', () => {
    it('should insert a new category', async () => {
      const category = {
        name: 'Category 1',
        description: 'Category 1 Description',
        addedBy: 'admin_id',
      }

      const expectedCategory = {
        _id: 'category_id',
        id: 'CAT-1001',
        name: 'Category 1',
        description: 'Category 1 Description',
        addedBy: 'John Doe',
        lastUpdatedBy: 'John Doe',
        isDeleted: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }

      const result = await CategoryService.insertCategory(category)

      expect(CategoryRepository.getLastInsertedCategory).toHaveBeenCalled()
      expect(CategoryRepository.insertCategory).toHaveBeenCalledWith(category)
      expect(result).toEqual(expectedCategory)
    })
  })

  describe('getCategories', () => {
    it('should retrieve all categories', async () => {
      const result = await CategoryService.getCategories()

      expect(CategoryRepository.getCategories).toHaveBeenCalled()
      expect(AdminRepository.getAdmins).toHaveBeenCalled()
      expect(result).toEqual([
        {
          _id: 'category_id',
          id: 'CAT-1001',
          name: 'Category 1',
          description: 'Category 1 Description',
          isDeleted: false,
          addedBy: 'John Doe',
          lastUpdatedBy: 'John Doe',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          _id: 'category_id',
          id: 'CAT-1002',
          name: 'Category 2',
          description: 'Category 2 Description',
          isDeleted: false,
          addedBy: 'John Doe',
          lastUpdatedBy: 'John Doe',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ])
    })
  })

  describe('getCategoryById', () => {
    it('should retrieve a category by ID', async () => {
      const categoryId = 'CAT-1001'

      const result = await CategoryService.getCategoryById(categoryId)

      expect(CategoryRepository.getCategoryById).toHaveBeenCalledWith(categoryId)
      expect(result).toEqual({
        _id: 'category_id',
        id: 'CAT-1001',
        name: 'Category 1',
        description: 'Category 1 Description',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'admin_id',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should throw an error if category not found', async () => {
      const categoryId = 'CAT-9999'
      CategoryRepository.getCategoryById.mockResolvedValue(null)

      await expect(CategoryService.getCategoryById(categoryId)).rejects.toThrow('Category with id CAT-9999 not found')

      expect(CategoryRepository.getCategoryById).toHaveBeenCalledWith(categoryId)
    })
  })

  describe('updateCategoryById', () => {
    it('should update a category by ID', async () => {
      const categoryId = 'CAT-1001'
      const updatedCategory = {
        name: 'Updated Category',
        description: 'Updated Category Description',
        lastUpdatedBy: 'admin_id',
      }

      const result = await CategoryService.updateCategoryById(categoryId, updatedCategory)

      expect(CategoryRepository.getCategoryById).toHaveBeenCalledWith(categoryId)
      expect(CategoryRepository.updateCategoryById).toHaveBeenCalledWith(categoryId, updatedCategory)
      expect(AdminRepository.getAdminById).toHaveBeenCalledWith(updatedCategory.lastUpdatedBy)
      expect(result).toEqual({
        _id: 'category_id',
        id: 'CAT-1001',
        name: 'Updated Category',
        description: 'Updated Category Description',
        isDeleted: false,
        addedBy: 'admin_id',
        lastUpdatedBy: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should throw an error if category not found', async () => {
      const categoryId = 'CAT-9999'
      const updatedCategory = {
        name: 'Updated Category',
        description: 'Updated Category Description',
        lastUpdatedBy: 'John Doe',
      }
      CategoryRepository.getCategoryById.mockResolvedValue(null)

      await expect(CategoryService.updateCategoryById(categoryId, updatedCategory)).rejects.toThrow('Category not found - id: CAT-9999')

      expect(CategoryRepository.getCategoryById).toHaveBeenCalledWith(categoryId)
      expect(CategoryRepository.updateCategoryById).not.toHaveBeenCalled()
    })
  })

  describe('deleteCategoryById', () => {
    it('should delete a category by ID', async () => {
      const categoryId = 'CAT-1001'

      const result = await CategoryService.deleteCategoryById(categoryId)

      expect(CategoryRepository.deleteCategoryById).toHaveBeenCalledWith(categoryId)
      expect(result).toBe(true)
    })

    it('should throw an error if category not found', async () => {
      const categoryId = 'CAT-9999'
      CategoryRepository.deleteCategoryById.mockResolvedValue(null)

      await expect(CategoryService.deleteCategoryById(categoryId)).rejects.toThrow('Category with id CAT-9999 not found')

      expect(CategoryRepository.deleteCategoryById).toHaveBeenCalledWith(categoryId)
    })
  })
})
