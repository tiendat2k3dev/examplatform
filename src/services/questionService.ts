// src/services/questionService.ts
import { Question } from "@/types/question";
import api from "../lib/apiClient.js";

// Lấy danh sách câu hỏi thuộc đề thi theo examId
export const getQuestionsByExamIdService = async (
  examId: string,
): Promise<Question[]> => {
  try {
    const response = await api.get<Question[]>(`/questions?examId=${examId}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách câu hỏi:", error);
    throw error;
  }
};
