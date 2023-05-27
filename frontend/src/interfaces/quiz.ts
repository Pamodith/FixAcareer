export interface QuizSettings {
  quizTitle: string;
  quizSynopsis: string;
  nrOfQuestions: string;
}

export interface QuizQuestion {
  question: string;
  questionType: string;
  questionPic?: string;
  answerSelectionType: string;
  answers: string[];
  correctAnswer: string | string[];
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  explanation: string;
  point: string;
}
