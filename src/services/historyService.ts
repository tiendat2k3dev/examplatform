// src/services/historyService.ts
import { History, SubmitExamPayload } from "@/types/history";
import api from "../lib/apiClient.js";

// 1. Lưu kết quả làm bài vào db.json
export const submitExamResultService = async (
  payload: SubmitExamPayload,
): Promise<History> => {
  try {
    const newRecord = {
      ...payload,
      completedAt: new Date().toISOString(),
    };

    const response = await api.post<History>("/histories", newRecord);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu kết quả bài thi:", error);
    throw error;
  }
};

// 2. Lấy chi tiết 1 lượt thi theo ID
export const getHistoryByIdService = async (
  historyId: string,
): Promise<History> => {
  try {
    const response = await api.get<History>(`/histories/${historyId}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lượt thi:", error);
    throw error;
  }
};

// 3. Lấy danh sách lịch sử làm bài của User
export const getUserHistoriesService = async (
  userId: string,
): Promise<History[]> => {
  try {
    const response = await api.get<History[] | { data: History[] }>(
      `/histories?userId=${userId}`,
    );

    const resData = response.data;

    let list: History[] = [];

    // json-server trả về mảng
    if (Array.isArray(resData)) {
      list = resData;
    }

    // Trường hợp API trả về object { data: [...] }
    else if (
      resData &&
      typeof resData === "object" &&
      "data" in resData &&
      Array.isArray(resData.data)
    ) {
      list = resData.data;
    }

    // Sắp xếp lượt thi mới nhất lên đầu
    return list.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  } catch (error) {
    console.error("Lỗi khi tải lịch sử bài thi của người dùng:", error);

    throw error;
  }
};
