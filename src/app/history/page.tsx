// src/app/history/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { initCurrentUser } from "@/redux/reducers/AuthReducer";
import { fetchUserHistoriesApiAsync } from "@/redux/reducers/HistoryReducer";
import { toast } from "react-toastify";

const HistoryPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isClientReady, setIsClientReady] = useState(false);

  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const { userHistories = [], loading } = useSelector(
    (state: RootState) => state.historyReducer
  );

  // 1. Đồng bộ tài khoản từ LocalStorage
  useEffect(() => {
    dispatch(initCurrentUser());
    setIsClientReady(true);
  }, [dispatch]);

  // 2. Fetch danh sách lịch sử sau khi đã có User
  useEffect(() => {
    if (!isClientReady) return;

    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để xem lịch sử làm bài!");
      router.push("/login");
      return;
    }

    dispatch(fetchUserHistoriesApiAsync(currentUser.id as string));
  }, [dispatch, currentUser, isClientReady, router]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  if (loading || !isClientReady) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải lịch sử...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill mb-2 fw-bold border border-primary border-opacity-25">
            <i className="bi bi-clock-history me-1"></i> Hồ Sơ Bài Thi
          </span>
          <h2 className="fw-bold display-6 text-dark m-0">Lịch Sử Làm Bài</h2>
          <p className="text-secondary small mt-1 mb-0">
            Theo dõi tiến độ học tập và điểm số các bài thi bạn đã hoàn thành.
          </p>
        </div>

        <Link
          href="/exam-category"
          className="btn btn-outline-primary fw-bold rounded-pill px-4 shadow-sm"
        >
          <i className="bi bi-plus-circle me-1"></i> Làm Thêm Bài Mới
        </Link>
      </div>

      {/* Bảng Lịch Sử */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="text-secondary small text-uppercase">
                <th className="py-3 ps-4">STT</th>
                <th className="py-3">Tên Bài Thi</th>
                <th className="py-3 text-center">Số Câu Đúng</th>
                <th className="py-3 text-center">Điểm Số</th>
                <th className="py-3 text-center">Thời Gian Làm</th>
                <th className="py-3 text-center">Ngày Nộp</th>
                <th className="py-3 text-center pe-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {userHistories && userHistories.length > 0 ? (
                userHistories.map((h, idx) => {
                  const isPassed = h.score >= 50;
                  return (
                    <tr key={h.id || idx}>
                      <td className="ps-4 fw-semibold text-muted">{idx + 1}</td>
                      <td>
                        <span className="fw-bold text-dark d-block">
                          {h.examTitle || `Bài thi #${h.examId}`}
                        </span>
                      </td>
                      <td className="text-center font-monospace">
                        {h.correctAnswersCount} / {h.totalQuestions}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill fs-6 px-3 py-1.5 ${
                            isPassed
                              ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
                              : "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
                          }`}
                        >
                          {h.score} Điểm
                        </span>
                      </td>
                      <td className="text-center text-muted small">
                        <i className="bi bi-stopwatch me-1"></i>
                        {formatDuration(h.timeTaken)}
                      </td>
                      <td className="text-center text-secondary small">
                        {formatDate(h.completedAt)}
                      </td>
                      <td className="text-center pe-4">
                        {isPassed ? (
                          <span className="badge bg-success text-white px-3 py-1.5 rounded-pill shadow-sm">
                            <i className="bi bi-check-circle me-1"></i> Đạt
                          </span>
                        ) : (
                          <span className="badge bg-danger text-white px-3 py-1.5 rounded-pill shadow-sm">
                            <i className="bi bi-x-circle me-1"></i> Chưa Đạt
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x fs-1 d-block mb-2 text-secondary"></i>
                    Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu ôn tập ngay!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;