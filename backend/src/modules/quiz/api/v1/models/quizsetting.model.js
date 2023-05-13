import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const QuizSettingSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    noOfEasyQuestions: {
      type: Number,
      required: true,
    },
    noOfMediumQuestions: {
      type: Number,
      required: true,
    },
    noOfHardQuestions: {
      type: Number,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    scoreOutOf: {
      type: Number,
      required: false,
      default: 100,
    },
    passingScore: {
      type: Number,
      required: false,
      default: 70,
    },
    retake: {
      type: Boolean,
      required: false,
      default: true,
    },
    retakeLimit: {
      type: Number,
      required: false,
      default: 3,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

QuizSettingSchema.index({ createdAt: 1 })

QuizSettingSchema.plugin(mongoosePaginate)

const QuizSetting = model('QuizSetting', QuizSettingSchema)

QuizSetting.syncIndexes()

export default QuizSetting
