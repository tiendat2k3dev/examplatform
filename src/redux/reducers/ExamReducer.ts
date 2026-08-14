// src/redux/reducers/ExamReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Exam } from "@/types/exam";
import {
  getExamsService,
  getPaginatedExamsService,
} from "@/services/examService";
import { AppDispatch } from "../store";

export interface ExamState {
  exams: Exam[];
  totalCount: number;
  currentPage: number;
  limit: number;
  loading: boolean;
}

const initialState: ExamState = {
  exams: [],
  totalCount: 0,
  currentPage: 1,
  limit: 6,
  loading: false,
};

const examReducer = createSlice({
  name: "examReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setPaginatedExams: (
      state,
      action: PayloadAction<{ data: Exam[]; totalCount: number; page: number }>
    ) => {
      state.exams = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      state.totalCount = action.payload.totalCount || 0;
      state.currentPage = action.payload.page || 1;
      state.loading = false;
    },
  },
});

export const { setLoading, setExams, setPaginatedExams } = examReducer.actions;
export default examReducer.reducer;

// Async Thunk lấy toàn bộ bài thi
export const fetchExamsApiAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getExamsService();
    dispatch(setExams(data));
  } catch (error: any) {
    dispatch(setLoading(false));
    console.error("Fetch exams error:", error);
    toast.error("Lỗi khi tải bài thi!");
  }
};

// Async Thunk lấy bài thi phân trang
export const fetchPaginatedExamsApiAsync =
  (page: number = 1, limit: number = 6, categoryId?: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await getPaginatedExamsService(page, limit, categoryId);
      dispatch(
        setPaginatedExams({
          data: res.data,
          totalCount: res.totalCount,
          page,
        })
      );
    } catch (error: any) {
      dispatch(setLoading(false));
      console.error("Fetch paginated exams error:", error);
      toast.error("Lỗi khi tải danh sách bài thi!");
    }
  };