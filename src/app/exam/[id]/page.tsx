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
import { generatePublicUserId } from "@/services/historyService";
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

  const isPublicUser = !currentUser;

  // Giữ cố định 1 mã Public ID trong suốt phiên làm bài
  const [publicUserId] = useState(() => generatePublicUserId());

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
    if (exams.length === 0) {
      dispatch(fetchExamsApiAsync());
    }

    const duration = currentExam ? currentExam.duration : 30;
    dispatch(fetchQuestionsByExamIdApiAsync(examId, duration));

    return () => {
      dispatch(resetQuiz());
    };
  }, [dispatch, examId, currentExam]);

  // 2. Logic nộp bài thi cho cả Member lẫn Public
  const handleSubmitExam = useCallback(
    (isAutoSubmit = false) => {
      if (isSubmitting || questions.length === 0) return;

      // Xác nhận nếu bấm nộp thủ công
      if (!isAutoSubmit) {
        const answered = Object.keys(userAnswers).length;
        const total = questions.length;
        const confirmMsg =
          answered < total
            ? `Bạn mới hoàn thành ${answered}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài sớm không?`
            : "Bạn có chắc chắn muốn nộp bài thi ngay bây giờ không?";

        if (!window.confirm(confirmMsg)) {
          return;
        }
      }

      setIsSubmitting(true);

      // Chấm điểm bài thi
      let correctCount = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correctAnswer) {
          correctCount += 1;
        }
      });

      const total = questions.length;
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const totalDuration = (currentExam?.duration || 30) * 60;
      const timeTaken = Math.max(1, totalDuration - timeLeft);

      // Gán định danh cho Public hoặc Member
      const finalUserId = currentUser ? String(currentUser.id) : publicUserId;
      const finalUserName = currentUser ? currentUser.fullName : "ANONYMOUS";

      const payload = {
        userId: finalUserId,
        userName: finalUserName,
        examId,
        examTitle: currentExam?.title || "Bài Thi Chuẩn",
        score,
        totalQuestions: total,
        correctAnswersCount: correctCount,
        timeTaken,
        userAnswers,
      };

      const openResultModal = () => {
        setQuizResult({
          score,
          correctCount,
          total,
          timeTaken,
        });
        setShowResultModal(true);
        setIsSubmitting(false);
      };

      // Gọi Redux Thunk lưu kết quả vào db.json và mở Modal
      dispatch(submitExamApiAsync(payload, openResultModal));
    },
    [
      isSubmitting,
      questions,
      userAnswers,
      currentExam,
      timeLeft,
      currentUser,
      publicUserId,
      examId,
      dispatch,
    ]
  );

  // 3. Đếm ngược thời gian
  useEffect(() => {
    if (
      timeLeft <= 0 &&
      questions.length > 0 &&
      !showResultModal &&
      !isSubmitting
    ) {
      toast.info("Đã hết giờ làm bài! Hệ thống tự động nộp bài.");
      handleSubmitExam(true);
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
      {/* Banner chế độ Public */}
      {isPublicUser && (
        <div className="alert alert-warning border border-warning d-flex align-items-center justify-content-between mb-4 rounded-3 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-bounding-box fs-4 text-warning"></i>
            <div>
              <strong>Chế độ Public:</strong> Bạn đang thi với mã định danh{" "}
              <code>{publicUserId}</code> (Tên: <strong>ANONYMOUS</strong>). Kết
              quả chỉ hiển thị <strong>1 lần duy nhất</strong> khi nộp bài và
              không thể tra cứu lại trong Lịch Sử cá nhân.
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="btn btn-sm btn-outline-dark fw-bold rounded-pill text-nowrap ms-3"
          >
            Đăng nhập
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Khung câu hỏi */}
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
                selectOption({ questionId: currentQ.id, optionIndex: index })
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

        {/* Sidebar điều khiển */}
        <div className="col-lg-4 col-xl-3">
          <QuizSidebar
            timeLeft={timeLeft}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onJumpQuestion={(index) => dispatch(setCurrentQuestionIndex(index))}
            onSubmitExam={() => handleSubmitExam(false)}
          />
        </div>
      </div>

      {/* Modal kết quả */}
      {showResultModal && quizResult && (
        <QuizResultModal
          score={quizResult.score}
          correctCount={quizResult.correctCount}
          total={quizResult.total}
          timeTaken={quizResult.timeTaken}
          examTitle={currentExam?.title}
          examId={examId}
          isPublic={isPublicUser}
          userId={currentUser ? String(currentUser.id) : publicUserId}
          userName={currentUser ? currentUser.fullName : "ANONYMOUS"}
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