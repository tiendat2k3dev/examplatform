// src/components/Quiz/QuizSidebar.tsx
import React from "react";
import { Question } from "@/types/question";

interface QuizSidebarProps {
  timeLeft: number;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>;
  onJumpQuestion: (index: number) => void;
  onSubmitExam: () => void;
}

export const QuizSidebar = ({
  timeLeft,
  questions,
  currentQuestionIndex,
  userAnswers,
  onJumpQuestion,
  onSubmitExam,
}: QuizSidebarProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div
      className="card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden sticky-top"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
        backdropFilter: "blur(15px)",
        top: "20px",
      }}
    >
      <div className="card-body p-4 text-center">
        {/* Timer */}
        <div className="mb-4">
          <small className="text-light opacity-75 d-block mb-1">
            Thời gian còn lại
          </small>
          <div className="fw-bold display-6 text-warning font-monospace">
            <i className="bi bi-clock-history me-2"></i>
            {formatTime(timeLeft)}
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-3" />

        {/* Danh sách Palette câu hỏi */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="fw-bold text-info">Danh Sách Câu Hỏi</small>
            <small className="text-light opacity-50">
              Đã làm: {answeredCount}/{questions.length}
            </small>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
      {questions.map((q, idx) => {
        const questionId = q.id ?? String(idx);
        const isAnswered = userAnswers[questionId] !== undefined;
        const isCurrent = currentQuestionIndex === idx;

        let btnClass = "btn-outline-secondary text-white";
        if (isCurrent) {
          btnClass = "btn-info text-white border-2 border-white";
        } else if (isAnswered) {
          btnClass = "btn-success text-white";
        }

        return (
          <button
            key={q.id ?? idx}
            onClick={() => onJumpQuestion(idx)}
            className={`btn rounded-3 ${btnClass}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    fontWeight: "bold",
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nút Nộp Bài */}
        <div className="d-grid">
          <button
            type="button"
            onClick={onSubmitExam}
            className="btn btn-danger fw-bold py-2 rounded-3 shadow"
          >
            <i className="bi bi-send-check-fill me-1"></i> Nộp Bài Thi
          </button>
        </div>
      </div>
    </div>
  );
};