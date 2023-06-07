export interface Answer {
  answer: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  id: string;
  question: string;
  answers: Answer[];
  addedBy: string;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionBasic {
  question: string;
  answers: Answer[];
}

export interface QuestionUpdate {
  _id: string;
  id: string;
  question: string;
  answers: Answer[];
}
