// src/redux/reducers/HistoryReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { History, SubmitExamPayload } from "@/types/history";
import {
  submitExamResultService,
  getHistoryByIdService,
  getUserHistoriesService,
} from "@/services/historyService";
import { AppDispatch } from "../store";

export interface HistoryState {
  userHistories: History[];
  currentHistory: History | null;
  loading: boolean;
}

const initialState: HistoryState = {
  userHistories: [],
  currentHistory: null,
  loading: false,
};

const historyReducer = createSlice({
  name: "historyReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserHistories: (state, action: PayloadAction<History[]>) => {
      state.userHistories = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setCurrentHistory: (state, action: PayloadAction<History | null>) => {
      state.currentHistory = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setUserHistories, setCurrentHistory } =
  historyReducer.actions;

export default historyReducer.reducer;

// Async Thunk: Nộp bài thi và lưu vào db.json
export const submitExamApiAsync =
  (payload: SubmitExamPayload, onSuccess?: (result: History) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const result = await submitExamResultService(payload);
      dispatch(setCurrentHistory(result));
      toast.success("Nộp bài thi thành công!");
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: any) {
      dispatch(setLoading(false));
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi gửi kết quả bài thi!";
      console.error("Submit exam error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };

// Async Thunk: Lấy chi tiết 1 bài thi đã nộp theo historyId (Dùng cho Result Page)
export const fetchHistoryByIdApiAsync =
  (historyId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const data = await getHistoryByIdService(historyId);
      dispatch(setCurrentHistory(data));
    } catch (error: any) {
      dispatch(setLoading(false));
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải kết quả bài thi!";
      console.error("Fetch history error:", error);
      toast.error(errorMsg);
    }
  };

// Async Thunk: Lấy toàn bộ lịch sử thi của User (Dùng cho History Page)
export const fetchUserHistoriesApiAsync =
  (userId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const list = await getUserHistoriesService(userId);
      dispatch(setUserHistories(list));
    } catch (error: any) {
      dispatch(setLoading(false));
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tải lịch sử thi!";
      console.error("Fetch user histories error:", error);
      toast.error(errorMsg);
    }
  };