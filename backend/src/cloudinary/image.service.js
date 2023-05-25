/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary'
import { moduleLogger } from '@sliit-foss/module-logger'

const logger = moduleLogger('Image-Uploader')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadImage = async (image, folder) => {
  return await cloudinary.uploader
    .upload(image, { folder: `images/${folder}/` })
    .then((result) => {
      logger.info(`Image uploaded successfully - id: ${result.public_id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when uploading image - err: ${err.message}`)
      throw err
    })
}

const deleteImage = async (public_id) => {
  return await cloudinary.uploader
    .destroy(public_id)
    .then((result) => {
      logger.info(`Image deleted successfully - id: ${result.public_id}`)
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting image - err: ${err.message}`)
      throw err
    })
}

const ImageService = {
  uploadImage,
  deleteImage,
}

export default ImageService
