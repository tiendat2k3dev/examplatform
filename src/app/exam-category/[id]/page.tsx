// src/app/exam-category/[id]/page.tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCategoriesApiAsync } from "@/redux/reducers/CategoryReducer";
import { fetchPaginatedExamsApiAsync } from "@/redux/reducers/ExamReducer";
import { toast } from "react-toastify";
import styles from "../ExamCategory.module.css";

const CategoryExamsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const categoryId = params.id as string;

  const { categories = [] } = useSelector(
    (state: RootState) => state.categoryReducer
  );

  const {
    exams = [],
    totalCount = 0,
    currentPage = 1,
    limit = 6,
    loading: examLoading,
  } = useSelector((state: RootState) => state.examReducer);

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const currentCategory = categories.find((cat) => cat.id === categoryId);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesApiAsync());
    }
    if (categoryId) {
      dispatch(fetchPaginatedExamsApiAsync(1, limit, categoryId));
    }
  }, [dispatch, categoryId, limit, categories.length]);

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      dispatch(fetchPaginatedExamsApiAsync(newPage, limit, categoryId));
    }
  };

  const handleStartExam = (examId: string) => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để bắt đầu làm bài thi!");
      router.push("/login");
      return;
    }
    router.push(`/exam/${examId}`);
  };

  if (examLoading && exams.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải bài thi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
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
              currentCategory?.color || "primary"
            } bg-opacity-10 text-${currentCategory?.color || "primary"}`}
          >
            <i
              className={`bi ${
                currentCategory?.icon || "bi-journal-text"
              } fs-1`}
            ></i>
          </div>
          <div>
            <h2 className={`fw-bold m-0 ${styles.titleGradient}`}>
              {currentCategory?.name || "Danh Sách Đề Thi"}
            </h2>
            <span className="badge bg-secondary bg-opacity-10 text-secondary border px-3 py-1 rounded-pill mt-2 fw-semibold">
              Tổng số: {totalCount} đề thi
            </span>
          </div>
        </div>
        <p className="text-secondary m-0 fs-6">
          {currentCategory?.description ||
            "Thử sức với các đề thi trắc nghiệm được tổng hợp chuẩn hóa kiến thức."}
        </p>
      </div>

      {/* DANH SÁCH BÀI THI */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {exams && exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam.id} className="col">
              <div
                className={`card h-100 rounded-4 bg-white shadow-sm p-2 ${styles.hoverCard}`}
              >
                <div className="card-body d-flex flex-column p-4">
                  <div className="mb-3">
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2.5 py-1.5 rounded-2 small fw-bold">
                      <i className="bi bi-award-fill me-1"></i> Đề Thi Chuẩn
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-3 flex-grow-1">
                    {exam.title}
                  </h5>

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
                      onClick={() => handleStartExam(exam.id)}
                      className="btn btn-primary fw-bold rounded-3 py-2 shadow-sm"
                    >
                      Vào Thi Ngay <i className="bi bi-play-circle-fill ms-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted fs-5">
              Chưa có bài thi nào thuộc nhóm này.
            </p>
          </div>
        )}
      </div>

      {/* NÚT PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 pt-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || examLoading}
            className={`btn btn-outline-primary ${styles.paginationBtn}`}
          >
            <i className="bi bi-chevron-left me-1"></i> Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={examLoading}
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
            disabled={currentPage === totalPages || examLoading}
            className={`btn btn-outline-primary ${styles.paginationBtn}`}
          >
            Sau <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryExamsPage;