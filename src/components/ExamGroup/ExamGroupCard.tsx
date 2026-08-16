// src/components/ExamGroup/ExamGroupCard.tsx
import React from "react";
import Link from "next/link";
import { ExamGroup } from "@/types/examGroup";
import styles from "@/app/exam-group/ExamGroup.module.css";

interface ExamGroupCardProps {
  examGroup: ExamGroup;
  examCount: number;
}

export const ExamGroupCard = ({ examGroup, examCount }: ExamGroupCardProps) => {
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
            <div
              className={`p-3 rounded-3 text-${examGroup.color} border border-${examGroup.color} border-opacity-50`}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <i className={`bi ${examGroup.icon} fs-2`}></i>
            </div>

            <span
              className={`badge text-${examGroup.color} border border-${examGroup.color} px-3 py-2 rounded-pill fw-bold`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {examCount} Đề thi
            </span>
          </div>

          <h4 className="fw-bold mb-2 text-white">{examGroup.name}</h4>
          <p className="text-light opacity-75 small mb-4 flex-grow-1">
            {examGroup.description}
          </p>

          <div className="d-flex align-items-center justify-content-between border-top border-secondary border-opacity-25 pt-3 mt-auto">
            <small className="text-light opacity-50">
              <i className="bi bi-people me-1"></i>1,200 lượt thi
            </small>

            {/* Cập nhật link sang /exam-group/[id] */}
            <Link
              href={`/exam-group/${examGroup.id}`}
              className="btn btn-outline-info btn-sm fw-bold rounded-pill px-3"
            >
              Xem Đề Thi <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};