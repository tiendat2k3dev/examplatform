// src/components/ExamGroup/ExamCard.tsx
import React from "react";
import { Exam } from "@/types/exam";
import styles from "@/app/exam-group/ExamGroup.module.css";

interface ExamCardProps {
  exam: Exam;
  onStartExam: (examId: string) => void;
}

export const ExamCard = ({ exam, onStartExam }: ExamCardProps) => {
  return (
    <div className="col">
      <div
        className={`card h-100 border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden ${styles.hoverCard}`}
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
          backdropFilter: "blur(15px)",
        }}
      >
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-primary bg-opacity-20 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill fw-semibold">
              <i className="bi bi-clock me-1"></i> {exam.duration} Phút
            </span>
            <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-25 px-3 py-2 rounded-pill">
              <i className="bi bi-question-circle me-1"></i> {exam.totalQuestions ?? 0} Câu hỏi
            </span>
          </div>

          <h5 className="fw-bold mb-3 text-white">{exam.name}</h5>

          <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
            <button
              type="button"
              onClick={() => onStartExam(exam.id)}
              className="btn btn-primary w-100 fw-bold rounded-3 py-2 shadow"
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
                border: "none",
              }}
            >
              <i className="bi bi-play-circle-fill me-1"></i> Bắt Đầu Làm Bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};