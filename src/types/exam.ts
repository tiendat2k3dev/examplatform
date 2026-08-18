// =========================================================
// EXAM TYPES
// Dùng chung cho cả trang public và trang admin.
// =========================================================

/** Nhóm đề thi rút gọn – dùng trong select dropdown */
export interface ExamGroup {
  id: string;
  name: string;
}

// =========================================================
// STATUS
// DB lưu "ACTIVE" / "INACTIVE".
// UI hiển thị "Hoạt động" / "Khóa".
// =========================================================

/** Giá trị status lưu trong DB (json-server) */
export type ExamStatusDB = "ACTIVE" | "INACTIVE";

/** Giá trị status hiển thị trên UI */
export type ExamStatusUI = "Hoạt động" | "Khóa";

/** Map DB → UI */
export const mapStatusToUI = (status: string): ExamStatusUI =>
  status === "ACTIVE" ? "Hoạt động" : "Khóa";

/** Map UI → DB */
export const mapStatusToDB = (status: ExamStatusUI): ExamStatusDB =>
  status === "Hoạt động" ? "ACTIVE" : "INACTIVE";

// =========================================================
// EXAM – khớp với db.json collection "exams"
// =========================================================

export interface Exam {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  examGroupId: string;
  duration: number;
  passScore: number;
  /** Status lưu trong DB */
  status: ExamStatusDB;
  creatorId: string;
  createdAt: string;
  updatedAt: string;

  /** Tổng số câu hỏi – tính từ exam_questions (không lưu trong DB) */
  totalQuestions?: number;
  /** Danh sách questionId – không lưu trong DB, chỉ dùng ở UI */
  questionIds?: string[];
}

// =========================================================
// EXAM_QUESTION – khớp với db.json collection "exam_questions"
// =========================================================

export interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  questionOrder: number;
}

// =========================================================
// QUESTION + ANSWER từ API
// Dùng trong ngân hàng câu hỏi của modal
// =========================================================

export interface AnswerOption {
  key: "A" | "B" | "C" | "D";
  value: string;
}

/**
 * Câu hỏi kèm đáp án – dùng trong CreateExamModal / EditExamModal / ViewExams.
 * Được build từ /questions + /answers của API.
 */
export interface QuestionWithAnswers {
  id: string;
  content: string;
  categoryId: string;
  /** Tên danh mục – resolve từ categoryId sau khi fetch /categories */
  categoryName?: string;
  answers: AnswerOption[];
  /** Label đáp án đúng: "A" | "B" | "C" | "D" */
  correctAnswer?: "A" | "B" | "C" | "D";
}

// =========================================================
// FORM VALUES – dùng khi tạo / sửa đề thi qua modal
// =========================================================

export interface CreateExamFormValues {
  id?: string;
  code: string;
  name: string;
  categoryId: string;
  examGroupId: string;
  duration: number;
  passScore: number;
  /** UI status – sẽ map sang DB trước khi gọi API */
  status: ExamStatusUI;
  creatorId?: string;
  questionIds: string[];
}

// =========================================================
// EDIT EXAM – dùng cho selectedExam trong modal Edit / Delete / View
// =========================================================

export interface EditExam {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  examGroupId: string;
  duration: number;
  passScore: number;
  /** UI status */
  status: ExamStatusUI;
  questionIds?: string[];
  questionDetails?: QuestionWithAnswers[];
}
