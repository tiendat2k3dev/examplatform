import { Exam } from "@/types/exam";
import api from "../lib/apiClient.js";

export interface PaginatedExamsResponse {
  data: Exam[];
  totalCount: number;
}

// 1. Lấy danh sách bài thi CÓ PHÂN TRANG
export const getPaginatedExamsService = async (
  page: number = 1,
  limit: number = 6,
  categoryId?: string,
): Promise<PaginatedExamsResponse> => {
  try {
    const categoryParam = categoryId ? `&categoryId=${categoryId}` : "";

    const response = await api.get(
      `/exams?_page=${page}&_per_page=${limit}${categoryParam}`,
    );

    const resData = response.data;

    // json-server v1.0+
    // {
    //   data: [...],
    //   items: X
    // }
    if (resData && Array.isArray(resData.data)) {
      return {
        data: resData.data,
        totalCount: resData.items ?? resData.data.length,
      };
    }

    // json-server v0.17
    // trả về mảng [...]
    if (Array.isArray(resData)) {
      const totalHeader = response.headers["x-total-count"];

      return {
        data: resData,
        totalCount: totalHeader ? parseInt(totalHeader, 10) : resData.length,
      };
    }

    return {
      data: [],
      totalCount: 0,
    };
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài thi phân trang:", error);
    throw error;
  }
};

// 2. Lấy tất cả bài thi
export const getExamsService = async (): Promise<Exam[]> => {
  try {
    const response = await api.get<Exam[]>("/exams");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài thi:", error);
    throw error;
  }
};
