// src/services/historyService.ts
import { History, SubmitExamPayload } from "@/types/history";
import axios from "axios";

const API_URL = "http://localhost:4000";

// 1. Lưu kết quả làm bài vào db.json
export const submitExamResultService = async (
  payload: SubmitExamPayload
): Promise<History> => {
  try {
    const newRecord = {
      ...payload,
      completedAt: new Date().toISOString(),
    };

    const response = await axios.post<History>(
      `${API_URL}/histories`,
      newRecord
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lưu kết quả bài thi:", error);
    throw error;
  }
};

// 2. Lấy chi tiết 1 lượt thi theo ID (Dùng cho Result)
export const getHistoryByIdService = async (
  historyId: string
): Promise<History> => {
  try {
    const response = await axios.get<History>(
      `${API_URL}/histories/${historyId}`
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
    const response = await axios.get<any>(
      `${API_URL}/histories?userId=${userId}`
    );

    const resData = response.data;
    let list: History[] = [];

    if (Array.isArray(resData)) {
      list = resData;
    } else if (resData && Array.isArray(resData.data)) {
      list = resData.data;
    }

    // Tự động sắp xếp ngày thi mới nhất lên trên đầu
    return list.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  } catch (error) {
    console.error("Lỗi khi tải lịch sử bài thi của người dùng:", error);
    throw error;
  }
};