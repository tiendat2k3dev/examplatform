// src/services/examGroupService.ts
import axios from "axios";
import { ExamGroup } from "@/types/examGroup";

const API_URL = "http://localhost:4000";

export interface PaginatedExamGroupsResponse {
  data: ExamGroup[];
  totalCount: number;
}

export const getPaginatedExamGroupsService = async (
  page: number = 1,
  limit: number = 3
): Promise<PaginatedExamGroupsResponse> => {
  try {
    // 1. Lấy toàn bộ nhóm đề thi từ json-server
    const response = await axios.get<ExamGroup[]>(`${API_URL}/ExamGroup`);
    const allGroups = Array.isArray(response.data)
      ? response.data
      : (response.data as any)?.data || [];

    const totalCount = allGroups.length;

    // 2. Tự động cắt dữ liệu phân trang
    const startIndex = (page - 1) * limit;
    const paginatedData = allGroups.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      totalCount,
    };
  } catch (error) {
    console.error("Lỗi khi tải danh sách nhóm đề thi:", error);
    throw error;
  }
};

export const getExamGroupsService = async (): Promise<ExamGroup[]> => {
  try {
    const response = await axios.get<ExamGroup[]>(`${API_URL}/ExamGroup`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ nhóm đề thi:", error);
    throw error;
  }
};