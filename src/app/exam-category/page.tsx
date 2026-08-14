// src/app/exam-category/page.tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPaginatedCategoriesApiAsync } from "@/redux/reducers/CategoryReducer";
import { fetchExamsApiAsync } from "@/redux/reducers/ExamReducer";
import styles from "./ExamCategory.module.css";

const ExamCategoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories = [],
    totalCount = 0,
    currentPage = 1,
    limit = 3,
    loading: catLoading,
  } = useSelector((state: RootState) => state.categoryReducer);

  const { exams = [] } = useSelector((state: RootState) => state.examReducer);

  useEffect(() => {
    dispatch(fetchPaginatedCategoriesApiAsync(1, limit));
    dispatch(fetchExamsApiAsync());
  }, [dispatch, limit]);

  const getExamCount = (categoryId: string) => {
    return exams.filter((exam) => exam.categoryId === categoryId).length;
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchPaginatedCategoriesApiAsync(newPage, limit));
    }
  };

  if (catLoading && categories.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải nhóm đề thi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
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

      {/* DANH SÁCH CÁC CATEGORIES */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {categories && categories.length > 0 ? (
          categories.map((cat) => {
            const count = getExamCount(cat.id);
            return (
              <div key={cat.id} className="col">
                <div
                  className={`card h-100 rounded-4 bg-white shadow-sm p-2 ${styles.hoverCard}`}
                >
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className={`p-3 rounded-3 bg-${cat.color} bg-opacity-10 text-${cat.color}`}
                      >
                        <i className={`bi ${cat.icon} fs-2`}></i>
                      </div>
                      <span
                        className={`badge bg-${cat.color} text-white px-3 py-2 rounded-pill fs-6 shadow-sm`}
                      >
                        {count} Đề thi
                      </span>
                    </div>

                    <h4 className="fw-bold mb-2 text-dark">{cat.name}</h4>
                    <p className="text-secondary small mb-4 flex-grow-1">
                      {cat.description}
                    </p>

                    <div className="d-grid mt-auto">
                      <Link
                        href={`/exam-category/${cat.id}`}
                        className={`btn btn-outline-${cat.color} fw-bold rounded-3 py-2`}
                      >
                        Xem Đề Thi <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">Chưa có nhóm đề thi nào.</p>
          </div>
        )}
      </div>

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 pt-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || catLoading}
            className={`btn btn-outline-primary ${styles.paginationBtn}`}
          >
            <i className="bi bi-chevron-left me-1"></i> Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={catLoading}
                className={`btn ${
                  currentPage === page
                    ? "btn-primary fw-bold"
                    : "btn-outline-secondary"
                } ${styles.paginationBtn}`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || catLoading}
            className={`btn btn-outline-primary ${styles.paginationBtn}`}
          >
            Sau <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCategoryPage;