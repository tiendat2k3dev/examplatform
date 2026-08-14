import { Category } from "@/types/category";
import axios from "axios";

const API_URL = "http://localhost:4000";

export interface PaginatedCategoriesResponse {
  data: Category[];
  totalCount: number;
}

// 1. Lấy danh mục CÓ PHÂN TRANG (Tương thích json-server v0.17 & v1.0+)
export const getPaginatedCategoriesService = async (
  page: number = 1,
  limit: number = 3
): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await axios.get<any>(
      `${API_URL}/categories?_page=${page}&_per_page=${limit}`
    );

    const resData = response.data;

    // Chuẩn json-server v1.0+ (trả về Object { data: [...], items: 6 })
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
    console.error("Lỗi khi tải danh mục phân trang:", error);
    throw error;
  }
};

// 2. Lấy TOÀN BỘ danh mục bài thi
export const getCategoriesService = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ danh mục:", error);
    throw error;
  }
};