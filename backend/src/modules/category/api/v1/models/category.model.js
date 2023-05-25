import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const CategorySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

CategorySchema.index({ createdAt: 1 })

CategorySchema.plugin(mongoosePaginate)

const Category = model('Category', CategorySchema)

Category.syncIndexes()

export default Category
