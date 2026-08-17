// src/services/questionService.ts

import { Question } from "@/types/question";
import api from "../lib/apiClient";

// Lấy danh sách câu hỏi thuộc đề thi theo examId
export const getQuestionsByExamIdService = async (
  examId: string
): Promise<Question[]> => {
  try {
    // 1. Gọi API lấy câu hỏi theo examId
    const response = await api.get<Question[]>(
      `/questions?examId=${encodeURIComponent(examId)}`
    );

    let questions = Array.isArray(response.data)
      ? response.data
      : [];

    // 2. Fallback: nếu API không trả về kết quả,
    // lấy toàn bộ câu hỏi rồi lọc thủ công
    if (questions.length === 0) {
      const allRes = await api.get<Question[]>("/questions");

      const allQuestions = Array.isArray(allRes.data)
        ? allRes.data
        : [];

      questions = allQuestions.filter(
        (q) => q.examId === examId
      );
    }

    return questions;
  } catch (error) {
    console.error("Lỗi khi tải danh sách câu hỏi:", error);
    throw error;
  }
};