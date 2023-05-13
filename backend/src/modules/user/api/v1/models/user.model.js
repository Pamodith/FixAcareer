import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      default: null,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    isFirstLogin: {
      type: Boolean,
      required: false,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.index({ createdAt: 1 })

UserSchema.plugin(mongoosePaginate)

const User = model('User', UserSchema)

User.syncIndexes()

export default User
