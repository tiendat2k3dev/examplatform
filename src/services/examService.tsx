// src/services/examService.ts
import axios from "axios";
import { Exam } from "@/types/exam";

const API_URL = "http://localhost:4000";

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
    const response = await axios.get<Exam[]>(`${API_URL}/exams`);
    let allExams = Array.isArray(response.data)
      ? response.data
      : (response.data as any)?.data || [];

    // Lọc theo examGroupId hoặc categoryId
    if (groupId) {
      allExams = allExams.filter(
        (e) => e.examGroupId === groupId || e.categoryId === groupId
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
    const response = await axios.get<Exam[]>(`${API_URL}/exams`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ bài thi:", error);
    throw error;
  }
};