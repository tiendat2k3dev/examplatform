// src/services/historyService.ts

import { History, SubmitExamPayload } from "@/types/history";
import api from "../lib/apiClient";

// Helper tạo mã số ngẫu nhiên cho Public User
export const generatePublicUserId = (): string => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `Public-${randomNum}`;
};

// 1. Lưu kết quả làm bài vào db.json
export const submitExamResultService = async (
  payload: SubmitExamPayload
): Promise<History> => {
  try {
    const isPublic =
      !payload.userId || payload.userId.startsWith("Public-");

    const finalUserId = isPublic
      ? payload.userId || generatePublicUserId()
      : payload.userId;

    const finalUserName = isPublic
      ? "ANONYMOUS"
      : payload.userName;

    const newRecord = {
      ...payload,
      userId: finalUserId,
      userName: finalUserName,
      completedAt: new Date().toISOString(),
    };

    const response = await api.post<History>(
      "/histories",
      newRecord
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu kết quả bài thi:", error);
    throw error;
  }
};

// 2. Lấy chi tiết 1 lượt thi theo ID
export const getHistoryByIdService = async (
  historyId: string
): Promise<History> => {
  try {
    const response = await api.get<History>(
      `/histories/${historyId}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lượt thi:", error);
    throw error;
  }
};

// 3. Lấy danh sách lịch sử làm bài của User
export const getUserHistoriesService = async (
  userId: string
): Promise<History[]> => {
  try {
    // Public User không có lịch sử
    if (!userId || userId.startsWith("Public-")) {
      return [];
    }

    const response = await api.get<
      History[] | { data: History[] }
    >(`/histories?userId=${encodeURIComponent(userId)}`);

    const resData = response.data;

    let list: History[] = [];

    if (Array.isArray(resData)) {
      list = resData;
    } else if (
      resData &&
      typeof resData === "object" &&
      "data" in resData &&
      Array.isArray(resData.data)
    ) {
      list = resData.data;
    }

    return list.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    );
  } catch (error) {
    console.error(
      "Lỗi khi tải lịch sử bài thi của người dùng:",
      error
    );

    throw error;
  }
};

// =====================================================
// LẤY TẤT CẢ LỊCH SỬ (Dùng cho trang Admin Dashboard)
// =====================================================

export const getAllHistoriesService = async (): Promise<History[]> => {
  try {
    const response = await api.get<History[]>("/histories");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải toàn bộ lịch sử:", error);

    throw error;
  }
};