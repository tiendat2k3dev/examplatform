// src/services/examService.ts
import { Exam } from "@/types/exam";
import api from "@/lib/apiClient";

interface ApiResponse<T> {
  data: T;
}

export interface PaginatedExamsResponse {
  data: Exam[];
  totalCount: number;
}

export const getPaginatedExamsService = async (
  page: number = 1,
  limit: number = 6,
  groupId?: string
): Promise<PaginatedExamsResponse> => {
  try {
    const [examsRes, examQuestionsRes] = await Promise.all([
      api.get<Exam[] | ApiResponse<Exam[]>>("/exams"),
      api.get<any[]>("/exam_questions"),
    ]);

    let allExams: Exam[] = Array.isArray(examsRes.data)
      ? examsRes.data
      : (examsRes.data as any).data;

    const allExamQuestions = Array.isArray(examQuestionsRes.data)
      ? examQuestionsRes.data
      : (examQuestionsRes.data as any).data || [];

    // Gắn số lượng câu hỏi thực tế tính từ bảng exam_questions
    allExams = allExams.map((exam) => {
      const qCount = allExamQuestions.filter(
        (eq: any) => eq.examId === exam.id
      ).length;
      return {
        ...exam,
        totalQuestions: exam.totalQuestions || qCount,
      };
    });

    if (groupId) {
      allExams = allExams.filter(
        (exam) => exam.examGroupId === groupId || exam.categoryId === groupId
      );
    }

    const totalCount = allExams.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = allExams.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      totalCount,
    };
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài thi:", error);
    throw error;
  }
};

export const getExamsService = async (): Promise<Exam[]> => {
  try {
    const [examsRes, examQuestionsRes] = await Promise.all([
      api.get<Exam[] | ApiResponse<Exam[]>>("/exams"),
      api.get<any[]>("/exam_questions"),
    ]);

    const allExams: Exam[] = Array.isArray(examsRes.data)
      ? examsRes.data
      : (examsRes.data as any).data;

    const allExamQuestions = Array.isArray(examQuestionsRes.data)
      ? examQuestionsRes.data
      : (examQuestionsRes.data as any).data || [];

    return allExams.map((exam) => ({
      ...exam,
      totalQuestions:
        exam.totalQuestions ||
        allExamQuestions.filter((eq: any) => eq.examId === exam.id).length,
    }));
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ bài thi:", error);
    throw error;
  }
};