import { Exam } from "@/types/exam";
import axios from "axios";

const API_URL = "http://localhost:4000";

export interface PaginatedExamsResponse {
  data: Exam[];
  totalCount: number;
}

// 1. Lấy danh sách bài thi CÓ PHÂN TRANG (Tương thích json-server v0.17 & v1.0+)
export const getPaginatedExamsService = async (
  page: number = 1,
  limit: number = 6,
  categoryId?: string,
): Promise<PaginatedExamsResponse> => {
  try {
    const categoryParam = categoryId ? `&categoryId=${categoryId}` : "";
    const response = await axios.get<any>(
      `${API_URL}/exams?_page=${page}&_per_page=${limit}${categoryParam}`,
    );

    const resData = response.data;

    // Chuẩn json-server v1.0+ (trả về Object { data: [...], items: X })
    if (resData && Array.isArray(resData.data)) {
      return {
        data: resData.data,
        totalCount: resData.items || resData.data.length,
      };
    }

    // Chuẩn json-server v0.17 (trả về Mảng [...])
    if (Array.isArray(resData)) {
      const totalHeader = response.headers["x-total-count"];
      return {
        data: resData,
        totalCount: totalHeader ? parseInt(totalHeader, 10) : resData.length,
      };
    }

    return { data: [], totalCount: 0 };
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài thi phân trang:", error);
    throw error;
  }
};

// 2. Lấy tất cả bài thi
export const getExamsService = async (): Promise<Exam[]> => {
  try {
    const response = await axios.get<Exam[]>(`${API_URL}/exams`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài thi:", error);
    throw error;
  }
};
