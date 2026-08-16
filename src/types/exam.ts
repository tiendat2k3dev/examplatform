export interface ExamGroup {
  id: string;
  name: string;
}

export interface Exam {
  id: string;
  categoryId: string;
  title: string;
  duration: number;
  totalQuestions: number;
}

export interface ExamQuestion {
  id: string;
  content: string;
  category: string;
  answers?: { key: "A" | "B" | "C" | "D"; value: string }[];
  correctAnswer?: "A" | "B" | "C" | "D";
}

export interface CreateExamFormValues {
  id: string;
  name: string;
  category: string;
  examGroupId: string;
  duration: number;
  passScore: number;
  status: "Hoạt động" | "Khóa";
  questionIds: string[];
}

export interface EditExam {
  id: string;
  name: string;
  category: string;
  examGroupId?: string;
  questions: number;
  duration: number;
  status: "Hoạt động" | "Khóa";
  passScore?: number;
  questionIds?: string[];
  questionDetails?: ExamQuestion[];
}
