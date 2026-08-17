// src/services/questionService.ts
import axios from "axios";
import { Question } from "@/types/question";
<<<<<<< HEAD
import api from "../lib/apiClient";
=======

const API_URL = "http://localhost:4000";
>>>>>>> e316793624ea43e124f14ae53a22518771301e72

// Lấy danh sách câu hỏi thuộc đề thi theo examId
export const getQuestionsByExamIdService = async (
  examId: string
): Promise<Question[]> => {
  try {
    // 1. Gọi trực tiếp API với URL tuyệt đối tới json-server
    const response = await axios.get<Question[]>(
      `${API_URL}/questions?examId=${encodeURIComponent(examId)}`
    );

    let questions = Array.isArray(response.data)
      ? response.data
      : (response.data as any)?.data || [];

    // 2. Fallback lọc thủ công nếu json-server trả về toàn bộ danh sách
    if (questions.length === 0) {
      const allRes = await axios.get<Question[]>(`${API_URL}/questions`);
      const allQuestions = Array.isArray(allRes.data)
        ? allRes.data
        : (allRes.data as any)?.data || [];
      questions = allQuestions.filter((q: any) => q.examId === examId);
    }

    return questions;
  } catch (error) {
    console.error("Lỗi khi tải danh sách câu hỏi:", error);
    throw error;
  }
};