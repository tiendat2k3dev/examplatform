import api from "../lib/apiClient.js";
import { Category } from "@/types/category";

export interface PaginatedCategoriesResponse {
  data: Category[];
  totalCount: number;
}

// 1. Lấy danh mục CÓ PHÂN TRANG
export const getPaginatedCategoriesService = async (
  page: number = 1,
  limit: number = 3,
): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await api.get(
      `/categories?_page=${page}&_per_page=${limit}`,
    );

    const resData = response.data;

    // json-server v1.0+
    // {
    //   data: [...],
    //   items: 6
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
    console.error("Lỗi khi tải danh mục phân trang:", error);
    throw error;
  }
};

// 2. Lấy TOÀN BỘ danh mục
export const getCategoriesService = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ danh mục:", error);
    throw error;
  }
};
