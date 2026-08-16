// src/components/ExamGroup/ExamGroupHeader.tsx
import React from "react";
import styles from "@/app/exam-group/ExamGroup.module.css";

export const ExamGroupHeader = () => {
  return (
    <div className="mb-4 text-center text-md-start">
      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 fw-bold border border-primary border-opacity-25">
        <i className="bi bi-folder-fill me-1"></i> Ngân Hàng Đề Thi
      </span>
      <h2 className={`fw-bold display-6 ${styles.titleGradient}`}>
        Danh Sách Nhóm Đề Thi
      </h2>
      <p className="text-muted fs-6">
        Lựa chọn nhóm môn học bạn muốn ôn luyện và tham gia làm bài thi thử nghiệm.
      </p>
    </div>
  );
};