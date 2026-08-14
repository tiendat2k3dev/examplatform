// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducer";
import categoryReducer from "./reducers/CategoryReducer";
import examReducer from "./reducers/ExamReducer";

export const store = configureStore({
  reducer: {
    authReducer,
    categoryReducer,
    examReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;