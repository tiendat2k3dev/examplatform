// src/components/common/Pagination.tsx
import React from "react";
import styles from "@/app/exam-category/ExamCategory.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  loading = false,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 pt-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`btn btn-outline-primary ${styles.paginationBtn}`}
      >
        <i className="bi bi-chevron-left me-1"></i> Trước
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`btn ${
              currentPage === page
                ? "btn-primary fw-bold"
                : "btn-outline-secondary"
            } ${styles.paginationBtn}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`btn btn-outline-primary ${styles.paginationBtn}`}
      >
        Sau <i className="bi bi-chevron-right ms-1"></i>
      </button>
    </div>
  );
};
