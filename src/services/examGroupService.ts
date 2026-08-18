// src/services/examGroupService.ts

import { ExamGroup } from "@/types/examGroup";
import api from "../lib/apiClient";

interface ApiResponse<T> {
  data: T;
}

export interface PaginatedExamGroupsResponse {
  data: ExamGroup[];
  totalCount: number;
}

// =====================================================
// LẤY NHÓM ĐỀ THI PHÂN TRANG
// =====================================================

export const getPaginatedExamGroupsService = async (
  page: number = 1,
  limit: number = 3,
): Promise<PaginatedExamGroupsResponse> => {
  try {
    const response = await api.get<ExamGroup[] | ApiResponse<ExamGroup[]>>(
      "/ExamGroup",
    );

    const allGroups: ExamGroup[] = Array.isArray(response.data)
      ? response.data
      : response.data.data;

    const totalCount = allGroups.length;

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

// =====================================================
// LẤY TOÀN BỘ NHÓM ĐỀ THI
// =====================================================

export const getExamGroupsService = async (): Promise<ExamGroup[]> => {
  try {
    const response = await api.get<ExamGroup[] | ApiResponse<ExamGroup[]>>(
      "/ExamGroup",
    );

    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ nhóm đề thi:", error);
    throw error;
  }
};

// =====================================================
// KIỂM TRA TÊN NHÓM ĐỀ THI TRÙNG
// Dùng cho Yup async validation trong modal Add/Edit
// =====================================================

export const checkExamGroupNameExistsService = async (
  name: string,
  excludeId?: string,
): Promise<boolean> => {
  try {
    const groups = await getExamGroupsService();

    const normalizedName = name.trim();

    return groups.some(
      (group) =>
        group.name.trim() === normalizedName &&
        (excludeId ? String(group.id) !== excludeId : true),
    );
  } catch (error) {
    console.error("Lỗi khi kiểm tra tên nhóm đề thi:", error);
    throw error;
  }
};

// =====================================================
// LẤY NHÓM ĐỀ THI THEO ID
// =====================================================

export const getExamGroupByIdService = async (
  id: string | number,
): Promise<ExamGroup> => {
  try {
    const response = await api.get<ExamGroup>(`/ExamGroup/${id}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải nhóm đề thi:", error);
    throw error;
  }
};

// =====================================================
// THÊM NHÓM ĐỀ THI
// =====================================================

export const createExamGroupService = async (
  groupData: Omit<ExamGroup, "id">,
): Promise<ExamGroup> => {
  try {
    const exists = await checkExamGroupNameExistsService(groupData.name);

    if (exists) {
      throw new Error(`EXAM_GROUP_NAME_EXISTS:${groupData.name}`);
    }

    const response = await api.post<ExamGroup>("/ExamGroup", groupData);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhóm đề thi:", error);
    throw error;
  }
};

// =====================================================
// SỬA NHÓM ĐỀ THI
// =====================================================

export const updateExamGroupService = async (
  id: string | number,
  groupData: Partial<ExamGroup>,
): Promise<ExamGroup> => {
  try {
    // Kiểm tra duplicate name (bỏ qua chính group đang sửa)

    if (groupData.name !== undefined) {
      const exists = await checkExamGroupNameExistsService(
        groupData.name,
        String(id),
      );

      if (exists) {
        throw new Error(`EXAM_GROUP_NAME_EXISTS:${groupData.name}`);
      }
    }

    const response = await api.patch<ExamGroup>(`/ExamGroup/${id}`, groupData);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhóm đề thi:", error);
    throw error;
  }
};

// =====================================================
// XÓA NHÓM ĐỀ THI
// =====================================================

export const deleteExamGroupService = async (
  id: string | number,
): Promise<void> => {
  try {
    await api.delete(`/ExamGroup/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa nhóm đề thi:", error);
    throw error;
  }
};
