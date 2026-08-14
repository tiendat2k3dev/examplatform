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
  duration: number;
  passScore: number;
  status: "Hoạt động" | "Khóa";
  questionIds: string[];
}

export interface EditExam {
  id: string;
  name: string;
  category: string;
  questions: number;
  duration: number;
  status: "Hoạt động" | "Khóa";
  passScore?: number;
  questionIds?: string[];
  questionDetails?: ExamQuestion[];
}
