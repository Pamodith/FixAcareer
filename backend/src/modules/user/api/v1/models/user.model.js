import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
)

const User = model('User', UserSchema)

export default User
