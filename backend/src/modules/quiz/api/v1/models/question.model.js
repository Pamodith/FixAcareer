import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const QuestionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
    },
    answers: [
      {
        answer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
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

QuestionSchema.index({ createdAt: 1 })

QuestionSchema.plugin(mongoosePaginate)

const Question = model('Question', QuestionSchema)

Question.syncIndexes()

export default Question
