// src/app/exam/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
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
import styles from "./ExamQuiz.module.css";

const ExamPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const examId = params.id as string;

  // Lấy dữ liệu từ Redux
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

  // 1. Kiểm tra xác thực & Tải bài thi
  useEffect(() => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập trước khi vào làm bài thi!");
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
  }, [dispatch, examId, currentUser, currentExam]);

  // 2. Xử lý đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft <= 0 && questions.length > 0 && !showResultModal && !isSubmitting) {
      toast.info("Đã hết giờ làm bài! Hệ thống tự động nộp bài thi.");
      handleConfirmSubmit();
      return;
    }

    const timer = setInterval(() => {
      if (timeLeft > 0 && !showResultModal) {
        dispatch(decrementTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions.length, showResultModal, isSubmitting]);

  // Định dạng thời gian mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 3. Logic Nộp bài & Chấm điểm
  const handleConfirmSubmit = () => {
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
    const totalDurationSeconds = (currentExam?.duration || 30) * 60;
    const timeTaken = totalDurationSeconds - timeLeft;

    const payload = {
      userId: currentUser?.id as string,
      examId: examId,
      examTitle: currentExam?.title || "Bài Thi Trắc Nghiệm",
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
      })
    );
  };

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  if (quizLoading || !currentQ) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang chuẩn bị đề thi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container py-4 ${styles.quizContainer}`}>
      {/* Top Header Bài Thi */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold mb-1">
              {currentExam?.title || "Đề Thi Trắc Nghiệm"}
            </span>
            <h5 className="fw-bold m-0 text-dark">
              Câu hỏi {currentQuestionIndex + 1} / {questions.length}
            </h5>
          </div>

          {/* Đồng hồ đếm ngược */}
          <div className="d-flex align-items-center gap-3">
            <div
              className={`badge px-4 py-2 rounded-pill shadow-sm fw-bold ${
                timeLeft < 300
                  ? "bg-danger text-white animate__animated animate__pulse animate__infinite"
                  : "bg-warning bg-opacity-10 text-warning border border-warning"
              } ${styles.timerBadge}`}
            >
              <i className="bi bi-stopwatch-fill me-2"></i>
              {formatTime(timeLeft)}
            </div>

            <button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
            >
              <i className="bi bi-check2-circle me-1"></i> Nộp Bài
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Khung Câu Hỏi & Đáp Án */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-4 lh-base">
              <span className="badge bg-primary me-2">Câu {currentQuestionIndex + 1}</span>
              {currentQ.questionText}
            </h5>

            {/* Các Lựa Chọn */}
            <div className="d-flex flex-column gap-3 mb-4">
              {currentQ.options.map((optionText, index) => {
                const isSelected = userAnswers[currentQ.id] === index;
                const optionLabel = ["A", "B", "C", "D"][index] || `${index + 1}`;

                return (
                  <div
                    key={index}
                    onClick={() =>
                      dispatch(
                        selectOption({
                          questionId: currentQ.id,
                          optionIndex: index,
                        })
                      )
                    }
                    className={`p-3 d-flex align-items-center gap-3 ${
                      styles.optionCard
                    } ${isSelected ? styles.optionCardActive : ""}`}
                  >
                    <span
                      className={`badge rounded-circle p-2 px-3 fw-bold ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-light text-secondary border"
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span className="fw-medium text-dark">{optionText}</span>
                  </div>
                );
              })}
            </div>

            {/* Nút Điều Hướng Câu Hỏi */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
              <button
                onClick={() =>
                  dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline-secondary rounded-pill px-3 fw-semibold"
              >
                <i className="bi bi-arrow-left me-1"></i> Câu Trước
              </button>

              <button
                onClick={() =>
                  dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1))
                }
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-primary rounded-pill px-4 fw-semibold"
              >
                Câu Kế Tiếp <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Khung Bảng Trạng Thái Các Câu Hỏi */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3 text-dark d-flex justify-content-between align-items-center">
              <span>Danh Sách Câu Hỏi</span>
              <span className="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill">
                Đã làm: {answeredCount}/{questions.length}
              </span>
            </h6>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => dispatch(setCurrentQuestionIndex(idx))}
                    className={`btn ${styles.navCircleBtn} ${
                      isCurrent
                        ? "btn-primary shadow"
                        : isAnswered
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="border-top pt-3 small text-muted d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle p-1.5"> </span>
                <span>Câu đang làm</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-circle p-1.5"> </span>
                <span>Đã chọn đáp án</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-outline-secondary border rounded-circle p-1.5"> </span>
                <span>Chưa hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL KẾT QUẢ BÀI THI ================= */}
      {showResultModal && quizResult && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-3">
              <div className="modal-body text-center p-4">
                <div
                  className={`display-3 mb-3 ${
                    quizResult.score >= 50 ? "text-success" : "text-danger"
                  }`}
                >
                  <i
                    className={`bi ${
                      quizResult.score >= 50
                        ? "bi-trophy-fill"
                        : "bi-exclamation-triangle-fill"
                    }`}
                  ></i>
                </div>

                <h3 className="fw-bold mb-1">
                  {quizResult.score >= 50 ? "Chúc Mừng Bạn!" : "Cần Cố Gắng Hơn!"}
                </h3>
                <p className="text-secondary small mb-4">
                  Bạn đã hoàn thành bài thi: <strong>{currentExam?.title}</strong>
                </p>

                {/* Khối Điểm Số */}
                <div className="bg-light rounded-4 p-3 mb-4">
                  <div className="row g-2">
                    <div className="col-4 border-end">
                      <div className="display-6 fw-bold text-primary">
                        {quizResult.score}
                      </div>
                      <div className="text-muted small fw-semibold">Điểm số</div>
                    </div>
                    <div className="col-4 border-end">
                      <div className="display-6 fw-bold text-success">
                        {quizResult.correctCount}/{quizResult.total}
                      </div>
                      <div className="text-muted small fw-semibold">Số câu đúng</div>
                    </div>
                    <div className="col-4">
                      <div className="display-6 fw-bold text-secondary">
                        {formatTime(quizResult.timeTaken)}
                      </div>
                      <div className="text-muted small fw-semibold">Thời gian</div>
                    </div>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="d-flex flex-column gap-2">
                  <button
                    onClick={() => router.push("/history")}
                    className="btn btn-primary fw-bold py-2.5 rounded-3 shadow-sm"
                  >
                    <i className="bi bi-clock-history me-1"></i> Xem Lịch Sử Bài Thi
                  </button>
                  <button
                    onClick={() => router.push("/exam-category")}
                    className="btn btn-outline-secondary fw-semibold py-2 rounded-3"
                  >
                    Về Danh Sách Nhóm Đề Thi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;