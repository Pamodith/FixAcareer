import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const JobSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

JobSchema.index({ createdAt: 1 })

JobSchema.plugin(mongoosePaginate)

const Job = model('Job', JobSchema)

Job.syncIndexes()

export default Job
