// src/redux/reducers/CategoryReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Category } from "@/types/category";
import {
  getCategoriesService,
  getPaginatedCategoriesService,
} from "@/services/categoryService";
import { AppDispatch } from "../store";

export interface CategoryState {
  categories: Category[];
  totalCount: number;
  currentPage: number;
  limit: number;
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  totalCount: 0,
  currentPage: 1,
  limit: 3,
  loading: false,
};

const categoryReducer = createSlice({
  name: "categoryReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    setPaginatedCategories: (
      state,
      action: PayloadAction<{ data: Category[]; totalCount: number; page: number }>
    ) => {
      state.categories = Array.isArray(action.payload.data)
        ? action.payload.data
        : [];
      state.totalCount = action.payload.totalCount || 0;
      state.currentPage = action.payload.page || 1;
      state.loading = false;
    },
  },
});

export const { setLoading, setCategories, setPaginatedCategories } =
  categoryReducer.actions;
export default categoryReducer.reducer;

// Async Thunk lấy danh mục có phân trang
export const fetchPaginatedCategoriesApiAsync =
  (page: number = 1, limit: number = 3) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await getPaginatedCategoriesService(page, limit);
      
      dispatch(
        setPaginatedCategories({
          data: res.data,
          totalCount: res.totalCount,
          page,
        })
      );
    } catch (error: any) {
      dispatch(setLoading(false));
      console.error("Fetch paginated categories error:", error);
      toast.error("Lỗi khi tải danh sách nhóm đề thi!");
    }
  };

// Async Thunk lấy toàn bộ danh mục
export const fetchCategoriesApiAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await getCategoriesService();
    dispatch(setCategories(data));
  } catch (error: any) {
    dispatch(setLoading(false));
    console.error("Fetch categories error:", error);
    toast.error("Lỗi khi tải danh mục!");
  }
};