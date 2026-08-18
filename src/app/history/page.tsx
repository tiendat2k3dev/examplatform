// src/app/history/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { RootState, AppDispatch } from "@/redux/store";
import { initCurrentUser } from "@/redux/reducers/AuthReducer";
import { fetchUserHistoriesApiAsync } from "@/redux/reducers/HistoryReducer";

import { History } from "@/types/history";
import { Category } from "@/types/categories";
import { Exam } from "../../types/exam";

import { getCategoriesService } from "@/services/categories";
import { getExamsService } from "../../services/examService";

const HistoryPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // ==========================
  // STATE
  // ==========================

  const [isClientReady, setIsClientReady] = useState(false);

  const [selectedHistory, setSelectedHistory] = useState<History | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ==========================
  // REDUX
  // ==========================

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const { userHistories = [], loading } = useSelector(
    (state: RootState) => state.historyReducer,
  );

  // ==========================
  // 1. ĐỒNG BỘ USER
  // ==========================

  useEffect(() => {
    dispatch(initCurrentUser());
    setIsClientReady(true);
  }, [dispatch]);

  // ==========================
  // 2. LẤY CATEGORY + EXAM
  // ==========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, examsData] = await Promise.all([
          getCategoriesService(),
          getExamsService(),
        ]);

        setCategories(categoriesData || []);
        setExams(examsData || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);

        toast.error("Không thể tải danh sách môn học và đề thi");
      }
    };

    fetchData();
  }, []);

  // ==========================
  // 3. TẢI LỊCH SỬ THI
  // ==========================

  useEffect(() => {
    if (!isClientReady) return;

    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để xem lịch sử làm bài!");

      router.push("/login");

      return;
    }

    dispatch(fetchUserHistoriesApiAsync(currentUser.id as string));
  }, [dispatch, currentUser, isClientReady, router]);

  // ==========================
  // FORMAT THỜI GIAN
  // ==========================

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds < 0) {
      return "00:00 phút";
    }

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")} phút`;
  };

  // ==========================
  // FORMAT NGÀY
  // ==========================

  const formatDate = (isoString: string) => {
    if (!isoString) {
      return "";
    }

    try {
      const date = new Date(isoString);

      if (isNaN(date.getTime())) {
        return isoString;
      }

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  // ==========================
  // LẤY EXAM THEO EXAM ID
  // ==========================

  const getExamById = (examId: string) => {
    if (!examId) {
      return undefined;
    }

    return exams.find((exam) => exam.id === examId);
  };

  // ==========================
  // LẤY CATEGORY THEO CATEGORY ID
  // ==========================

  const getCategoryById = (categoryId: string) => {
    if (!categoryId) {
      return undefined;
    }

    return categories.find((category) => category.id === categoryId);
  };

  // ==========================
  // LẤY TÊN MÔN HỌC
  // ==========================

  const getSubjectBadge = (examId: string) => {
    const exam = getExamById(examId);

    if (!exam) {
      return {
        name: "Không xác định",
        color: "secondary",
      };
    }

    const category = getCategoryById(exam.categoryId);

    if (!category) {
      return {
        name: "Không xác định",
        color: "secondary",
      };
    }

    return {
      name: category.name,
      color: "primary",
    };
  };

  // ==========================
  // LẤY TÊN ĐỀ THI
  // ==========================

  const getExamTitle = (history: History) => {
    if (history.examTitle) {
      return history.examTitle;
    }

    const exam = getExamById(history.examId);

    if (exam) {
      return exam.name;
    }

    return `Bài thi ${history.examId}`;
  };

  // ==========================
  // PHÂN TRANG
  // ==========================

  const totalPages = Math.ceil(userHistories.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = userHistories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ==========================
  // LOADING
  // ==========================

  if (loading || !isClientReady) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải lịch sử bài thi...</span>
        </div>
      </div>
    );
  }

  // ==========================
  // UI
  // ==========================

  return (
    <main className="container my-auto py-5 position-relative">
      {/* Background gradient */}

      <div
        className="position-absolute rounded-circle opacity-30"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(13, 110, 253, 0.35) 0%, rgba(0, 0, 0, 0) 70%)",
          top: "-100px",
          left: "-50px",
          pointerEvents: "none",
        }}
      />

      <div className="position-relative z-1">
        {/* ==========================
            HEADER
        ========================== */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <span
              className="badge text-primary border border-primary px-3 py-2 rounded-pill mb-2 fw-bold"
              style={{
                backgroundColor: "rgba(13, 110, 253, 0.1)",
              }}
            >
              <i className="bi bi-clock-history me-1"></i>
              Nhật Ký Thi Trắc Nghiệm
            </span>

            <h2 className="fw-bold display-6 m-0 text-dark">
              Lịch Sử Làm Bài Thi
            </h2>
          </div>

          <div className="d-flex gap-2">
            <Link
              href="/exam-group"
              className="btn btn-outline-primary fw-bold rounded-pill px-4"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Thi Bài Mới
            </Link>
          </div>
        </div>

        {/* ==========================
            TABLE
        ========================== */}

        <div
          className="card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden mb-4"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table
                className="table table-dark table-hover align-middle m-0"
                style={{
                  background: "transparent",
                }}
              >
                {/* ==========================
                    THEAD
                ========================== */}

                <thead className="border-bottom border-secondary border-opacity-25 bg-primary bg-opacity-10 text-info">
                  <tr>
                    <th className="py-3 ps-4">STT</th>

                    <th className="py-3">Tên Bài Thi</th>

                    <th className="py-3">Môn Học</th>

                    <th className="py-3">Ngày Làm</th>

                    <th className="py-3">Thời Gian</th>

                    <th className="py-3">Điểm Số</th>

                    <th className="py-3">Trạng Thái</th>

                    <th className="py-3 text-end pe-4">Thao Tác</th>
                  </tr>
                </thead>

                {/* ==========================
                    TBODY
                ========================== */}

                <tbody>
                  {currentItems && currentItems.length > 0 ? (
                    currentItems.map((h, idx) => {
                      const isPassed = h.score >= 50;

                      const score10 = ((h.score / 100) * 10).toFixed(1);

                      // Lấy môn học từ API

                      const badgeInfo = getSubjectBadge(h.examId);

                      return (
                        <tr key={h.id || idx}>
                          {/* STT */}

                          <td className="ps-4 text-light opacity-75">
                            {startIndex + idx + 1}
                          </td>

                          {/* TÊN BÀI THI */}

                          <td className="fw-bold text-white">
                            {getExamTitle(h)}
                          </td>

                          {/* MÔN HỌC */}

                          <td>
                            <span
                              className={`badge text-${badgeInfo.color} border border-${badgeInfo.color}`}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                              }}
                            >
                              {badgeInfo.name}
                            </span>
                          </td>

                          {/* NGÀY */}

                          <td className="text-light opacity-75">
                            {formatDate(h.completedAt)}
                          </td>

                          {/* THỜI GIAN */}

                          <td className="text-light opacity-75">
                            {formatDuration(h.timeTaken)}
                          </td>

                          {/* ĐIỂM */}

                          <td
                            className={`fw-bold fs-6 ${
                              isPassed ? "text-success" : "text-danger"
                            }`}
                          >
                            {score10} / 10
                          </td>

                          {/* TRẠNG THÁI */}

                          <td>
                            {isPassed ? (
                              <span
                                className="badge text-success border border-success px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: "rgba(25, 135, 84, 0.15)",
                                }}
                              >
                                Đạt
                              </span>
                            ) : (
                              <span
                                className="badge text-danger border border-danger px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: "rgba(220, 53, 69, 0.15)",
                                }}
                              >
                                Chưa đạt
                              </span>
                            )}
                          </td>

                          {/* THAO TÁC */}

                          <td className="text-end pe-4">
                            <button
                              type="button"
                              onClick={() => setSelectedHistory(h)}
                              className="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-5 text-light opacity-50"
                      >
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        Bạn chưa làm bài thi nào. Bấm &quot;Thi Bài Mới&quot; để
                        bắt đầu ôn luyện!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ==========================
            PAGINATION
        ========================== */}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-md m-0">
                {/* PREVIOUS */}

                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link bg-light text-secondary border-secondary border-opacity-50 px-3 py-2 rounded-start-3"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>
                </li>

                {/* PAGE NUMBER */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className={`page-link px-3 py-2 ${
                        currentPage === page
                          ? "bg-primary border-primary text-white fw-bold"
                          : "bg-white text-dark border-secondary border-opacity-50"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* NEXT */}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link bg-white text-primary border-secondary border-opacity-50 px-3 py-2 rounded-end-3"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* ==========================
          MODAL CHI TIẾT
      ========================== */}

      {selectedHistory && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border border-primary border-opacity-50 text-white rounded-4 overflow-hidden shadow-lg"
              style={{
                background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
              }}
            >
              {/* HEADER */}

              <div className="modal-header border-secondary border-opacity-25 p-4">
                <h5 className="modal-title fw-bold text-info">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Chi Tiết Lượt Thi
                </h5>

                <button
                  type="button"
                  onClick={() => setSelectedHistory(null)}
                  className="btn-close btn-close-white"
                ></button>
              </div>

              {/* BODY */}

              <div className="modal-body p-4">
                <h5 className="fw-bold text-white mb-3">
                  {getExamTitle(selectedHistory)}
                </h5>

                {/* MÔN HỌC */}

                <div className="mb-3">
                  <span className="text-light opacity-75 me-2">Môn học:</span>

                  <span className="badge text-primary border border-primary">
                    {getSubjectBadge(selectedHistory.examId).name}
                  </span>
                </div>

                {/* THÔNG TIN */}

                <div
                  className="p-3 rounded-3 border border-secondary border-opacity-25 mb-3"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light opacity-75">
                      Điểm số (Thang 10):
                    </span>

                    <span className="fw-bold text-info fs-5">
                      {((selectedHistory.score / 100) * 10).toFixed(1)} / 10
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light opacity-75">
                      Số câu trả lời đúng:
                    </span>

                    <span className="fw-bold text-success">
                      {selectedHistory.correctAnswersCount} /{" "}
                      {selectedHistory.totalQuestions}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light opacity-75">
                      Thời gian hoàn thành:
                    </span>

                    <span className="text-white">
                      {formatDuration(selectedHistory.timeTaken)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-light opacity-75">Ngày nộp bài:</span>

                    <span className="text-white">
                      {formatDate(selectedHistory.completedAt)}
                    </span>
                  </div>
                </div>

                {/* THI LẠI */}

                <div className="d-grid mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/exam/${selectedHistory.examId}`)
                    }
                    className="btn btn-primary fw-bold py-2 rounded-3 shadow"
                    style={{
                      background:
                        "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
                      border: "none",
                    }}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i>
                    Thi Lại Đề Này
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
