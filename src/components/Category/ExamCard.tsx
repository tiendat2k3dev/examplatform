// src/components/Category/ExamCard.tsx
import React from "react";
import { Exam } from "@/types/exam";
import styles from "@/app/exam-category/ExamCategory.module.css";

interface ExamCardProps {
  exam: Exam;
  onStartExam: (examId: string) => void;
}

export const ExamCard = ({ exam, onStartExam }: ExamCardProps) => {
  return (
    <div className="col">
      <div
        className={`card h-100 rounded-4 bg-white shadow-sm p-2 ${styles.hoverCard}`}
      >
        <div className="card-body d-flex flex-column p-4">
          <div className="mb-3">
            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2.5 py-1.5 rounded-2 small fw-bold">
              <i className="bi bi-award-fill me-1"></i> Đề Thi Chuẩn
            </span>
          </div>

          <h5 className="fw-bold text-dark mb-3 flex-grow-1">{exam.title}</h5>

          <div className="d-flex align-items-center justify-content-between text-muted small border-top border-bottom py-2 my-auto">
            <span>
              <i className="bi bi-clock me-1 text-primary"></i>
              {exam.duration} Phút
            </span>
            <span>
              <i className="bi bi-question-circle me-1 text-success"></i>
              {exam.totalQuestions} Câu hỏi
            </span>
          </div>

          <div className="d-grid mt-4">
            <button
              onClick={() => onStartExam(exam.id)}
              className="btn btn-primary fw-bold rounded-3 py-2 shadow-sm"
            >
              Vào Thi Ngay <i className="bi bi-play-circle-fill ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};