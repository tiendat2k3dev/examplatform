// src/app/exam/[id]/page.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchExamsApiAsync } from "@/redux/reducers/ExamReducer";
import {
  fetchQuestionsByExamIdApiAsync,
  selectOption,
  setCurrentQuestionIndex,
  decrementTime,
  resetQuiz,
} from "@/redux/reducers/QuizReducer";
import { submitExamApiAsync } from "@/redux/reducers/HistoryReducer";
import { toast } from "react-toastify";

import { QuizQuestionBox } from "@/components/Quiz/QuizQuestionBox";
import { QuizSidebar } from "@/components/Quiz/QuizSidebar";
import { QuizResultModal } from "@/components/Quiz/QuizResultModal";

const ExamPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const examId = params.id as string;

  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const { exams } = useSelector((state: RootState) => state.examReducer);
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    timeLeft,
    loading: quizLoading,
  } = useSelector((state: RootState) => state.quizReducer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctCount: number;
    total: number;
    timeTaken: number;
  } | null>(null);

  const currentExam = exams.find((e) => e.id === examId);

  // 1. Tải đề thi và câu hỏi
  useEffect(() => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để làm bài thi!");
      router.push("/login");
      return;
    }

    if (exams.length === 0) {
      dispatch(fetchExamsApiAsync());
    }

    const duration = currentExam ? currentExam.duration : 30;
    dispatch(fetchQuestionsByExamIdApiAsync(examId, duration));

    return () => {
      dispatch(resetQuiz());
    };
  }, [dispatch, examId, currentUser, currentExam, router]);

  // 2. Định nghĩa hàm handleSubmitExam LÊN TRƯỚC useEffect đếm giờ
  const handleSubmitExam = useCallback(() => {
    if (isSubmitting || questions.length === 0) return;
    setIsSubmitting(true);

    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const total = questions.length;
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const totalDuration = (currentExam?.duration || 30) * 60;
    const timeTaken = totalDuration - timeLeft;

    const payload = {
      userId: currentUser?.id as string,
      examId,
      examTitle: currentExam?.title || "Bài Thi Chuẩn",
      score,
      totalQuestions: total,
      correctAnswersCount: correctCount,
      timeTaken: timeTaken > 0 ? timeTaken : 1,
      userAnswers,
    };

    dispatch(
      submitExamApiAsync(payload, () => {
        setQuizResult({
          score,
          correctCount,
          total,
          timeTaken,
        });
        setShowResultModal(true);
        setIsSubmitting(false);
      }),
    );
  }, [
    isSubmitting,
    questions,
    userAnswers,
    currentExam,
    timeLeft,
    currentUser,
    examId,
    dispatch,
  ]);

  // 3. Đồng hồ đếm ngược (Gọi handleSubmitExam an toàn)
  useEffect(() => {
    if (
      timeLeft <= 0 &&
      questions.length > 0 &&
      !showResultModal &&
      !isSubmitting
    ) {
      toast.info("Đã hết giờ làm bài! Tự động nộp bài.");
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      if (timeLeft > 0 && !showResultModal) {
        dispatch(decrementTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    timeLeft,
    questions.length,
    showResultModal,
    isSubmitting,
    handleSubmitExam,
    dispatch,
  ]);

  const currentQ = questions[currentQuestionIndex];

  if (quizLoading || !currentQ) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Đang tải đề thi...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid px-3 px-md-5 my-auto py-4 position-relative">
      <div className="row g-4">
        {/* Cột Trái: Nội dung câu hỏi */}
        <div className="col-lg-8 col-xl-9">
          <QuizQuestionBox
            examTitle={currentExam?.title}
            examId={examId}
            question={currentQ}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedOptionIndex={userAnswers[currentQ.id]}
            onSelectOption={(index) =>
              dispatch(
                selectOption({ questionId: currentQ.id, optionIndex: index }),
              )
            }
            onPrev={() =>
              dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))
            }
            onNext={() =>
              dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))
            }
          />
        </div>

        {/* Cột Phải: Timer & Palette */}
        <div className="col-lg-4 col-xl-3">
          <QuizSidebar
            timeLeft={timeLeft}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onJumpQuestion={(index) => dispatch(setCurrentQuestionIndex(index))}
            onSubmitExam={handleSubmitExam}
          />
        </div>
      </div>

      {/* Modal Kết Quả Mới */}
      {showResultModal && quizResult && (
        <QuizResultModal
          score={quizResult.score}
          correctCount={quizResult.correctCount}
          total={quizResult.total}
          timeTaken={quizResult.timeTaken}
          examTitle={currentExam?.title}
          examId={examId}
          onRetryExam={() => {
            setShowResultModal(false);
            const duration = currentExam ? currentExam.duration : 30;
            dispatch(fetchQuestionsByExamIdApiAsync(examId, duration));
          }}
        />
      )}
    </main>
  );
};

export default ExamPage;
