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
  userAnswers: Record<string, number>;
  timeLeft: number;
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

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const randomizeQuestions = (rawQuestions: Question[]): Question[] => {
  const shuffledQuestions = shuffleArray(rawQuestions);

  return shuffledQuestions.map((q) => {
    if (
      !q.options ||
      q.correctAnswer === undefined ||
      typeof q.correctAnswer !== "number"
    ) {
      return q;
    }

    const originalCorrectText = q.options[q.correctAnswer];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectAnswerIndex = shuffledOptions.findIndex(
      (opt) => opt === originalCorrectText,
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
    initQuizData: (
      state,
      action: PayloadAction<{ questions: Question[]; durationMinutes: number }>,
    ) => {
      state.questions = randomizeQuestions(action.payload.questions);
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.timeLeft = action.payload.durationMinutes * 60;
      state.isSubmitted = false;
      state.loading = false;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    selectOption: (
      state,
      action: PayloadAction<{ questionId: string; optionIndex: number }>,
    ) => {
      state.userAnswers[action.payload.questionId] = action.payload.optionIndex;
    },
    decrementTime: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    setSubmitted: (state) => {
      state.isSubmitted = true;
    },
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

export const fetchQuestionsByExamIdApiAsync =
  (examId: string, durationMinutes: number) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const questions = await getQuestionsByExamIdService(examId);
      dispatch(initQuizData({ questions, durationMinutes }));
    } catch (error) {
      dispatch(setLoading(false));
      const errorMsg = getErrorMessage(error, "Lỗi khi tải câu hỏi bài thi!");
      console.error("Fetch questions error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };
