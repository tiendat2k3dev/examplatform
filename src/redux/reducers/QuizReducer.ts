// src/redux/reducers/QuizReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Question } from "@/types/question";
import { getQuestionsByExamIdService } from "@/services/questionService";
import { getErrorMessage } from "@/utils/errorHandler";
import { AppDispatch } from "../store";

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>; // Mapping: { [questionId]: selectedOptionIndex }
  timeLeft: number;                    // Thời gian còn lại (tính bằng giây)
  isSubmitted: boolean;
  loading: boolean;
}

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  timeLeft: 0,
  isSubmitted: false,
  loading: false,
};

// 1. Thuật toán Fisher-Yates xáo trộn mảng tổng quát
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 2. Xáo trộn thứ tự câu hỏi và tái định vị index đáp án đúng (correctAnswer)
const randomizeQuestions = (rawQuestions: Question[]): Question[] => {
  // Xáo trộn thứ tự câu hỏi
  const shuffledQuestions = shuffleArray(rawQuestions);

  return shuffledQuestions.map((q) => {
    // Lưu lại nội dung đáp án đúng ban đầu
    const originalCorrectText = q.options[q.correctAnswer];

    // Xáo trộn các lựa chọn A, B, C, D
    const shuffledOptions = shuffleArray(q.options);

    // Cập nhật lại chỉ số correctAnswer theo vị trí mới
    const newCorrectAnswerIndex = shuffledOptions.findIndex(
      (opt) => opt === originalCorrectText
    );

    return {
      ...q,
      options: shuffledOptions,
      correctAnswer:
        newCorrectAnswerIndex !== -1 ? newCorrectAnswerIndex : q.correctAnswer,
    };
  });
};

const quizReducer = createSlice({
  name: "quizReducer",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Khởi tạo bài thi với bộ câu hỏi đã xáo trộn
    initQuizData: (
      state,
      action: PayloadAction<{ questions: Question[]; durationMinutes: number }>
    ) => {
      state.questions = randomizeQuestions(action.payload.questions);
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.timeLeft = action.payload.durationMinutes * 60;
      state.isSubmitted = false;
      state.loading = false;
    },
    // Chuyển sang câu hỏi khác
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    // Người dùng chọn đáp án cho 1 câu
    selectOption: (
      state,
      action: PayloadAction<{ questionId: string; optionIndex: number }>
    ) => {
      state.userAnswers[action.payload.questionId] = action.payload.optionIndex;
    },
    // Giảm 1 giây cho đồng hồ đếm ngược
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    // Đánh dấu đã hoàn thành bài thi
    setSubmitted: (state) => {
      state.isSubmitted = true;
    },
    // Reset bài thi khi rời khỏi trang
    resetQuiz: (state) => {
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.timeLeft = 0;
      state.isSubmitted = false;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  initQuizData,
  setCurrentQuestionIndex,
  selectOption,
  decrementTime,
  setSubmitted,
  resetQuiz,
} = quizReducer.actions;

export default quizReducer.reducer;

// Async Thunk: Tải danh sách câu hỏi của Exam
export const fetchQuestionsByExamIdApiAsync =
  (examId: string, durationMinutes: number) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const questions = await getQuestionsByExamIdService(examId);
      dispatch(initQuizData({ questions, durationMinutes }));
    } catch (error) {
      dispatch(setLoading(false));
      const errorMsg = getErrorMessage(
        error,
        "Lỗi khi tải câu hỏi bài thi!"
      );
      console.error("Fetch questions error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };