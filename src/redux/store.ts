// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducer";
import categoryReducer from "./reducers/CategoryReducer";
import examReducer from "./reducers/ExamReducer";
import quizReducer from "./reducers/QuizReducer";
import historyReducer from "./reducers/HistoryReducer";

export const store = configureStore({
  reducer: {
    authReducer,
    categoryReducer,
    examReducer,
    quizReducer,
    historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;