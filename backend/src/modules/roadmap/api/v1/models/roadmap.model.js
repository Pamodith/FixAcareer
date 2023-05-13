import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const RoadmapSchema = new Schema(
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
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
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
    steps: [
      {
        number: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        recommendedLevel: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        recommendedDuration: {
          type: String,
          required: true,
        },
        priority: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

RoadmapSchema.index({ createdAt: 1 })

RoadmapSchema.plugin(mongoosePaginate)

const Roadmap = model('Roadmap', RoadmapSchema)

Roadmap.syncIndexes()

export default Roadmap
