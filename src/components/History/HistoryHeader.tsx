// src/components/History/HistoryHeader.tsx
import React from "react";
import Link from "next/link";

export const HistoryHeader = () => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
      <div>
        <span
          className="badge text-primary border border-primary px-3 py-2 rounded-pill mb-2 fw-bold"
          style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
        >
          <i className="bi bi-clock-history me-1"></i> Nhật Ký Thi Trắc Nghiệm
        </span>
        <h2 className="fw-bold display-6 m-0 text-dark">Lịch Sử Làm Bài Thi</h2>
      </div>

      <Link
        href="/exam-category"
        className="btn btn-outline-primary fw-bold rounded-pill px-4 shadow-sm"
      >
        <i className="bi bi-plus-circle me-1"></i> Thi Bài Mới
      </Link>
    </div>
  );
};