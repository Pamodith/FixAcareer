import express from 'express'
import { tracedAsyncHandler } from '@sliit-foss/functions'
import { toSuccess, toError } from '../../../../utils'
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
    await CategoryService.insertCategory(req.body)
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
    await CategoryService.updateCategoryById(req.params.id, req.body)
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
