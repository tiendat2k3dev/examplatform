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

// =========================
// LẤY DANH SÁCH BÀI THI PHÂN TRANG
// =========================
export const getPaginatedExamsService = async (
  page: number = 1,
  limit: number = 6,
  groupId?: string,
): Promise<PaginatedExamsResponse> => {
  try {
    const response = await api.get<Exam[] | ApiResponse<Exam[]>>("/exams");

    let allExams: Exam[] = Array.isArray(response.data)
      ? response.data
      : response.data.data;

    // =========================
    // LỌC THEO NHÓM ĐỀ / CATEGORY
    // =========================
    if (groupId) {
      allExams = allExams.filter(
        (exam) => exam.examGroupId === groupId || exam.categoryId === groupId,
      );
    }

    // =========================
    // TỔNG SỐ BÀI THI
    // =========================
    const totalCount = allExams.length;

    // =========================
    // PHÂN TRANG
    // =========================
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

// =========================
// LẤY TOÀN BỘ BÀI THI
// =========================
export const getExamsService = async (): Promise<Exam[]> => {
  try {
    const response = await api.get<Exam[] | ApiResponse<Exam[]>>("/exams");

    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ bài thi:", error);

    throw error;
  }
};
