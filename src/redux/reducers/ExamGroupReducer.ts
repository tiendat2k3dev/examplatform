// src/redux/reducers/ExamGroupReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ExamGroup } from "@/types/examGroup";
import {
  getExamGroupsService,
  getPaginatedExamGroupsService,
} from "@/services/examGroupService";
import { AppDispatch } from "../store";

export interface ExamGroupState {
  examGroups: ExamGroup[];
  totalCount: number;
  currentPage: number;
  limit: number;
  loading: boolean;
}

const initialState: ExamGroupState = {
  examGroups: [],
  totalCount: 0,
  currentPage: 1,
  limit: 3,
  loading: false,
};

const examGroupReducer = createSlice({
  name: "examGroupReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExamGroups: (state, action: PayloadAction<ExamGroup[]>) => {
      state.examGroups = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setPaginatedExamGroups: (
      state,
      action: PayloadAction<{ data: ExamGroup[]; totalCount: number; page: number }>
    ) => {
      state.examGroups = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      state.totalCount = action.payload.totalCount || 0;
      state.currentPage = action.payload.page || 1;
      state.loading = false;
    },
  },
});

export const { setLoading, setExamGroups, setPaginatedExamGroups } =
  examGroupReducer.actions;
export default examGroupReducer.reducer;

export const fetchPaginatedExamGroupsApiAsync =
  (page: number = 1, limit: number = 3) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await getPaginatedExamGroupsService(page, limit);

      dispatch(
        setPaginatedExamGroups({
          data: res.data,
          totalCount: res.totalCount,
          page,
        })
      );
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Fetch paginated exam groups error:", error);
      toast.error("Lỗi khi tải danh sách nhóm đề thi!");
    }
  };

export const fetchExamGroupsApiAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getExamGroupsService();
    dispatch(setExamGroups(data));
  } catch (error) {
    dispatch(setLoading(false));
    console.error("Fetch exam groups error:", error);
    toast.error("Lỗi khi tải danh sách nhóm đề thi!");
  }
};