// src/services/questionService.ts
import { Question } from "@/types/question";
import axios from "axios";

const API_URL = "http://localhost:4000";

// Lấy danh sách câu hỏi thuộc đề thi theo examId
export const getQuestionsByExamIdService = async (
  examId: string
): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(
      `${API_URL}/questions?examId=${examId}`
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách câu hỏi:", error);
    throw error;
  }
};