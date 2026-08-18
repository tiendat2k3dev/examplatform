export type AnswerLabel = "A" | "B" | "C" | "D";

export interface Question {
  id: string;
  content: string;
  categoryId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;

  // ---- Legacy API fields (matching db.json) ----
  examId?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: number | AnswerLabel;
  explanation?: string;

  // ---- Form / UI fields ----
  answers?: Answer[];
  category?: string;
  question?: string;
}

export interface Answer {
  id: string;
  content: string;
  label: AnswerLabel;
  isCorrect: boolean;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
}

export interface AnswerOption {
  key: AnswerLabel;
  value: string;
}

export interface CreateQuestionData {
  content: string;
  categoryId: string;
  answers: AnswerOption[];
  correctAnswer: AnswerLabel;
}

export interface UpdateQuestionData {
  content: string;
  categoryId: string;
  answers: AnswerOption[];
  correctAnswer: AnswerLabel;
}
