import { model, Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const QuizSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        isAnswered: {
          type: Boolean,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        timeTaken: {
          type: Number,
          required: true,
        },
      },
    ],
    totalScore: {
      type: Number,
      required: true,
    },
    totalTimetaken: {
      type: Number,
      required: true,
    },
    claculatedIQ: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

QuizSchema.index({ createdAt: 1 })

QuizSchema.plugin(mongoosePaginate)

const Quiz = model('Quiz', QuizSchema)

Quiz.syncIndexes()

export default Quiz
