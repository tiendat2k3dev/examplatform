// src/components/Category/ExamHeader.tsx
import React from "react";
import Link from "next/link";
import { Category } from "@/types/category";
import styles from "@/app/exam-category/ExamCategory.module.css";

interface ExamHeaderProps {
  category?: Category;
  totalExams: number;
}

export const ExamHeader = ({ category, totalExams }: ExamHeaderProps) => {
  return (
    <>
      {/* Nút Quay Lại */}
      <div className="mb-4">
        <Link
          href="/exam-category"
          className="btn btn-outline-secondary btn-sm fw-bold rounded-pill px-3 shadow-sm"
        >
          <i className="bi bi-arrow-left me-1"></i> Quay lại Nhóm Đề Thi
        </Link>
      </div>

      {/* Header Thông Tin Nhóm */}
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className={`p-3 rounded-3 bg-${
              category?.color || "primary"
            } bg-opacity-10 text-${category?.color || "primary"}`}
          >
            <i className={`bi ${category?.icon || "bi-journal-text"} fs-1`}></i>
          </div>
          <div>
            <h2 className={`fw-bold m-0 ${styles.titleGradient}`}>
              {category?.name || "Danh Sách Đề Thi"}
            </h2>
            <span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-1 rounded-pill mt-2 fw-semibold">
              Tổng số: {totalExams} đề thi
            </span>
          </div>
        </div>
        <p className="text-secondary m-0 fs-6">
          {category?.description ||
            "Thử sức với các đề thi trắc nghiệm được tổng hợp chuẩn hóa kiến thức."}
        </p>
      </div>
    </>
  );
};