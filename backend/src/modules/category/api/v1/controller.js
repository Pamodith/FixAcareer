import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import formidable from 'formidable'
import { toSuccess, toError } from '../../../../utils'
import ImageService from '../../../../cloudinary/image.service'
import CategoryService from './service/category.service'

const category = express.Router()

category.get(
  '/health',
  tracedAsyncHandler(function healthCheck(_req, res) {
    return toSuccess({ res, message: 'Server up and running!' })
  }),
)

category.post(
  '/',
  tracedAsyncHandler(async function insertCategory(req, res) {
    const form = formidable({ multiples: true })
    const category = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    if (category.files.image) {
      await ImageService.uploadImage(category.files.image.filepath, 'category')
        .then((data) => {
          category.fields.image = data.secure_url
        })
        .catch((err) => {
          return toError({ res, message: err.message })
        })
    }
    await CategoryService.insertCategory(category.fields)
      .then((data) => {
        return toSuccess({ res, status: 201, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

category.get(
  '/',
  tracedAsyncHandler(async function getCategories(_req, res) {
    await CategoryService.getCategories()
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

category.get(
  '/:id',
  tracedAsyncHandler(async function getCategoryById(req, res) {
    await CategoryService.getCategoryById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

category.put(
  '/:id',
  tracedAsyncHandler(async function updateCategoryById(req, res) {
    const form = formidable({ multiples: true })
    const category = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    const categoryToUpdate = {
      name: category.fields.name,
      description: category.fields.description,
      lastUpdatedBy: category.fields.lastUpdatedBy,
    }
    if (category.files.image) {
      await ImageService.uploadImage(category.files.image.filepath, 'category')
        .then((data) => {
          categoryToUpdate.image = data.secure_url
        })
        .catch((err) => {
          return toError({ res, message: err.message })
        })
    }
    await CategoryService.updateCategoryById(req.params.id, categoryToUpdate)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

category.delete(
  '/:id',
  tracedAsyncHandler(async function deleteCategoryById(req, res) {
    await CategoryService.deleteCategoryById(req.params.id)
      .then((data) => {
        return toSuccess({ res, status: 200, data, message: 'Success' })
      })
      .catch((err) => {
        return toError({ res, message: err.message })
      })
  }),
)

export default category
