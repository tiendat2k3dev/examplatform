// src/components/Category/CategoryCard.tsx
import React from "react";
import Link from "next/link";
import { Category } from "@/types/category";
import styles from "@/app/exam-category/ExamCategory.module.css";

interface CategoryCardProps {
  category: Category;
  examCount: number;
  attemptsCount?: number;
}

export const CategoryCard = ({
  category,
  examCount,
  attemptsCount = 1200,
}: CategoryCardProps) => {
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
          {/* Top Icon & Badge */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div
              className={`p-3 rounded-3 text-${category.color} border border-${category.color} border-opacity-50`}
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <i className={`bi ${category.icon} fs-2`}></i>
            </div>

            <span
              className={`badge text-${category.color} border border-${category.color} px-3 py-2 rounded-pill fw-bold`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
              {examCount} Đề thi
            </span>
          </div>

          {/* Tiêu đề & Mô tả */}
          <h4 className="fw-bold mb-2 text-white">{category.name}</h4>
          <p className="text-light opacity-75 small mb-4 flex-grow-1">
            {category.description}
          </p>

          {/* Footer */}
          <div className="d-flex align-items-center justify-content-between border-top border-secondary border-opacity-25 pt-3 mt-auto">
            <small className="text-light opacity-50">
              <i className="bi bi-people me-1"></i>
              {attemptsCount.toLocaleString("vi-VN")} lượt thi
            </small>

            <Link
              href={`/exam-category/${category.id}`}
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