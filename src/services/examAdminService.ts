// src/services/examAdminService.ts
//
// Service cho trang Admin – Quản lý đề thi.
// Kết nối với json-server qua apiClient (baseURL = NEXT_PUBLIC_API_URL).
//
// Endpoints sử dụng:
//   GET/POST/PATCH/DELETE  /exams
//   GET/POST/DELETE        /exam_questions
//   GET                    /questions
//   GET                    /answers?questionId=...
//   GET                    /categories
//   GET                    /ExamGroup

import api from "@/lib/apiClient";

import type {
  Exam,
  ExamQuestion,
  QuestionWithAnswers,
  CreateExamFormValues,
  EditExam,
} from "@/types/exam";

import { mapStatusToDB, mapStatusToUI } from "@/types/exam";

import type { Category } from "@/types/categories";
import type { ExamGroup } from "@/types/examGroup";
import type { Answer } from "@/types/question";

// =========================================================
// INTERNAL RAW TYPES (khớp json-server)
// =========================================================

interface RawAnswer {
  id: string;
  content: string;
  label: string;
  isCorrect: boolean;
  questionId: string;
}

interface RawQuestion {
  id: string;
  content: string;
  categoryId: string;
}

interface RawExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  questionOrder: number;
}

// =========================================================
// HELPERS
// =========================================================

/** Tạo ID ngắn dạng nanoid (không cần thêm package) */
const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** Map label string → AnswerKey */
const toAnswerKey = (label: string): "A" | "B" | "C" | "D" => {
  const upper = label.toUpperCase();
  if (upper === "A" || upper === "B" || upper === "C" || upper === "D") {
    return upper;
  }
  return "A";
};

// =========================================================
// CATEGORIES
// =========================================================

/**
 * Lấy toàn bộ danh mục từ /categories.
 */
export const getAdminCategoriesService = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>("/categories");
  return Array.isArray(res.data) ? res.data : [];
};

// =========================================================
// EXAM GROUPS
// =========================================================

/**
 * Lấy toàn bộ nhóm đề thi từ /ExamGroup.
 * Endpoint dùng chữ hoa E theo db.json.
 */
export const getAdminExamGroupsService = async (): Promise<ExamGroup[]> => {
  const res = await api.get<ExamGroup[]>("/ExamGroup");
  return Array.isArray(res.data) ? res.data : [];
};

// =========================================================
// QUESTIONS (ngân hàng câu hỏi)
// =========================================================

/**
 * Lấy toàn bộ câu hỏi và đáp án từ /questions + /answers.
 * Trả về QuestionWithAnswers[] để dùng trong modal.
 *
 * @param categories - Danh sách category đã fetch để resolve tên
 */
export const getAdminQuestionsService = async (
  categories: Category[],
): Promise<QuestionWithAnswers[]> => {
  // Fetch song song questions và answers
  const [questionsRes, answersRes] = await Promise.all([
    api.get<RawQuestion[]>("/questions"),
    api.get<RawAnswer[]>("/answers"),
  ]);

  const questions = Array.isArray(questionsRes.data) ? questionsRes.data : [];
  const answers = Array.isArray(answersRes.data) ? answersRes.data : [];

  // Build map: categoryId → categoryName
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return questions.map((q) => {
    // Lọc đáp án theo questionId và sắp xếp theo label
    const qAnswers = answers
      .filter((a) => a.questionId === q.id)
      .sort((a, b) => a.label.localeCompare(b.label));

    // Tìm đáp án đúng
    const correct = qAnswers.find((a) => a.isCorrect);

    return {
      id: q.id,
      content: q.content,
      categoryId: q.categoryId,
      categoryName: categoryMap.get(q.categoryId) ?? q.categoryId,
      answers: qAnswers.map((a) => ({
        key: toAnswerKey(a.label),
        value: a.content,
      })),
      correctAnswer: correct ? toAnswerKey(correct.label) : undefined,
    };
  });
};

// =========================================================
// EXAMS – READ
// =========================================================

/**
 * Lấy toàn bộ đề thi kèm số câu hỏi từ exam_questions.
 * Trả về Exam[] với `totalQuestions` và `questionIds` được điền sẵn.
 */
export const getAdminExamsService = async (): Promise<Exam[]> => {
  const [examsRes, examQuestionsRes] = await Promise.all([
    api.get<Exam[]>("/exams"),
    api.get<RawExamQuestion[]>("/exam_questions"),
  ]);

  const exams = Array.isArray(examsRes.data) ? examsRes.data : [];
  const examQuestions = Array.isArray(examQuestionsRes.data)
    ? examQuestionsRes.data
    : [];

  // Build map: examId → questionId[] (sorted by questionOrder)
  const examQMap = new Map<string, string[]>();
  examQuestions
    .sort((a, b) => a.questionOrder - b.questionOrder)
    .forEach((eq) => {
      const list = examQMap.get(eq.examId) ?? [];
      list.push(eq.questionId);
      examQMap.set(eq.examId, list);
    });

  return exams.map((exam) => ({
    ...exam,
    questionIds: examQMap.get(exam.id) ?? [],
    totalQuestions: (examQMap.get(exam.id) ?? []).length,
  }));
};

// =========================================================
// EXAMS – CREATE
// =========================================================

/**
 * Tạo đề thi mới:
 * 1. POST /exams
 * 2. POST /exam_questions (1 record cho mỗi questionId)
 *
 * @param values - Giá trị từ CreateExamFormValues (status là UI)
 * @param creatorId - ID người tạo (lấy từ currentUser)
 */
export const createAdminExamService = async (
  values: CreateExamFormValues,
  creatorId: string = "admin",
): Promise<Exam> => {
  const now = new Date().toISOString();

  // Tạo đề thi
  const examPayload: Omit<Exam, "totalQuestions" | "questionIds"> = {
    id: generateId(),
    code: values.code.trim(),
    name: values.name.trim(),
    categoryId: values.categoryId,
    examGroupId: values.examGroupId,
    duration: values.duration,
    passScore: values.passScore,
    status: mapStatusToDB(values.status),
    creatorId: values.creatorId ?? creatorId,
    createdAt: now,
    updatedAt: now,
  };

  const examRes = await api.post<Exam>("/exams", examPayload);
  const createdExam = examRes.data;

  // Tạo exam_questions
  if (values.questionIds.length > 0) {
    await Promise.all(
      values.questionIds.map((questionId, index) =>
        api.post<ExamQuestion>("/exam_questions", {
          id: generateId(),
          examId: createdExam.id,
          questionId,
          questionOrder: index + 1,
        }),
      ),
    );
  }

  return {
    ...createdExam,
    questionIds: values.questionIds,
    totalQuestions: values.questionIds.length,
  };
};

// =========================================================
// EXAMS – UPDATE
// =========================================================

/**
 * Cập nhật đề thi:
 * 1. PATCH /exams/:id
 * 2. Xóa toàn bộ exam_questions cũ rồi tạo lại theo questionIds mới
 *
 * @param examId - ID đề thi cần cập nhật
 * @param values - Giá trị form mới
 */
export const updateAdminExamService = async (
  examId: string,
  values: CreateExamFormValues,
): Promise<Exam> => {
  const now = new Date().toISOString();

  // PATCH exam
  const examPayload: Partial<Omit<Exam, "id" | "createdAt">> = {
    code: values.code.trim(),
    name: values.name.trim(),
    categoryId: values.categoryId,
    examGroupId: values.examGroupId,
    duration: values.duration,
    passScore: values.passScore,
    status: mapStatusToDB(values.status),
    updatedAt: now,
  };

  const examRes = await api.patch<Exam>(`/exams/${examId}`, examPayload);
  const updatedExam = examRes.data;

  // Lấy exam_questions hiện tại của đề thi
  const oldEqRes = await api.get<RawExamQuestion[]>(
    `/exam_questions?examId=${encodeURIComponent(examId)}`,
  );
  const oldEqs = Array.isArray(oldEqRes.data) ? oldEqRes.data : [];

  // Xóa tất cả exam_questions cũ
  await Promise.all(
    oldEqs.map((eq) => api.delete(`/exam_questions/${eq.id}`)),
  );

  // Tạo exam_questions mới
  if (values.questionIds.length > 0) {
    await Promise.all(
      values.questionIds.map((questionId, index) =>
        api.post<ExamQuestion>("/exam_questions", {
          id: generateId(),
          examId,
          questionId,
          questionOrder: index + 1,
        }),
      ),
    );
  }

  return {
    ...updatedExam,
    questionIds: values.questionIds,
    totalQuestions: values.questionIds.length,
  };
};

// =========================================================
// EXAMS – TOGGLE STATUS
// =========================================================

/**
 * Toggle trạng thái đề thi ACTIVE ↔ INACTIVE.
 *
 * @param examId  - ID đề thi
 * @param current - Status DB hiện tại
 * @returns Status DB mới sau khi đổi
 */
export const toggleAdminExamStatusService = async (
  examId: string,
  current: Exam["status"],
): Promise<Exam["status"]> => {
  const newStatus: Exam["status"] = current === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await api.patch(`/exams/${examId}`, {
    status: newStatus,
    updatedAt: new Date().toISOString(),
  });

  return newStatus;
};

// =========================================================
// EXAMS – DELETE
// =========================================================

/**
 * Xóa đề thi và toàn bộ exam_questions liên quan.
 *
 * @param examId - ID đề thi cần xóa
 */
export const deleteAdminExamService = async (examId: string): Promise<void> => {
  // Lấy exam_questions của đề thi
  const eqRes = await api.get<RawExamQuestion[]>(
    `/exam_questions?examId=${encodeURIComponent(examId)}`,
  );
  const eqs = Array.isArray(eqRes.data) ? eqRes.data : [];

  // Xóa exam_questions trước
  await Promise.all(eqs.map((eq) => api.delete(`/exam_questions/${eq.id}`)));

  // Xóa đề thi
  await api.delete(`/exams/${examId}`);
};

// =========================================================
// CONVERT Exam (DB) → EditExam (UI)
// =========================================================

/**
 * Chuyển `Exam` (status DB) thành `EditExam` (status UI) để truyền vào modal.
 */
export const toEditExam = (exam: Exam): EditExam => ({
  id: exam.id,
  code: exam.code,
  name: exam.name,
  categoryId: exam.categoryId,
  examGroupId: exam.examGroupId,
  duration: exam.duration,
  passScore: exam.passScore,
  status: mapStatusToUI(exam.status),
  questionIds: exam.questionIds ?? [],
});
