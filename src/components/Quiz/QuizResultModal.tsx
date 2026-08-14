// src/components/Quiz/QuizResultModal.tsx
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./QuizResultModal.module.css";

interface QuizResultModalProps {
  score: number; // Thang 100
  correctCount: number;
  total: number;
  timeTaken: number;
  examTitle?: string;
  examId: string;
  onRetryExam?: () => void;
}

export const QuizResultModal = ({
  score,
  correctCount,
  total,
  timeTaken,
  examTitle,
  examId,
  onRetryExam,
}: QuizResultModalProps) => {
  const router = useRouter();

  const score10 = ((score / 100) * 10).toFixed(1);
  const wrongCount = total - correctCount;
  const isPassed = score >= 50;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`modal fade show d-block ${styles.modalBackdrop}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg position-relative">
        {/* Vòng tròn hiệu ứng phát sáng */}
        <div
          className={`${styles.glowCircle} ${
            isPassed ? styles.glowSuccess : styles.glowDanger
          }`}
        ></div>

        <div className={`modal-content rounded-4 text-white overflow-hidden ${styles.modalCard}`}>
          {/* Header kết quả */}
          <div className="p-4 p-md-5 text-center border-bottom border-secondary border-opacity-25 bg-primary bg-opacity-10">
            <div
              className={`d-inline-flex p-3 rounded-circle border mb-3 shadow-sm ${
                isPassed
                  ? `text-success ${styles.iconBadgeSuccess}`
                  : `text-danger ${styles.iconBadgeDanger}`
              }`}
            >
              <i
                className={`bi ${
                  isPassed ? "bi-trophy-fill" : "bi-exclamation-triangle-fill"
                } display-4`}
              ></i>
            </div>

            <h2
              className={`fw-bold mb-1 ${
                isPassed ? styles.titleGradientSuccess : styles.titleGradientDanger
              }`}
            >
              {isPassed ? "Hoàn Thành Bài Thi!" : "Chưa Đạt Yêu Cầu!"}
            </h2>
            <p className="text-light opacity-75 small m-0">
              Môn thi: {examTitle || "Bài Thi Trắc Nghiệm"} ({examId})
            </p>
          </div>

          {/* Body Điểm số & Thống kê */}
          <div className="card-body p-4 p-md-5">
            {/* Khối hiển thị Điểm */}
            <div
              className={`text-center p-4 rounded-4 border mb-4 ${styles.scoreBox} ${
                isPassed
                  ? "border-success border-opacity-25"
                  : "border-danger border-opacity-25"
              }`}
            >
              <small className="text-light opacity-75 d-block mb-1">
                Điểm số của bạn
              </small>
              <div
                className={`display-3 fw-bold font-monospace mb-2 ${
                  isPassed ? "text-success" : "text-danger"
                }`}
              >
                {score10} <span className="fs-4 text-light opacity-50">/ 10</span>
              </div>
              <span
                className={`badge border px-4 py-2 rounded-pill fw-bold ${
                  isPassed
                    ? `text-success border-success ${styles.tagBadgeSuccess}`
                    : `text-danger border-danger ${styles.tagBadgeDanger}`
                }`}
              >
                <i
                  className={`bi ${
                    isPassed ? "bi-check-circle-fill" : "bi-x-circle-fill"
                  } me-1`}
                ></i>
                {isPassed ? "ĐÃ ĐẠT YÊU CẦU" : "CHƯA ĐẠT YÊU CẦU"}
              </span>
            </div>

            {/* Chi tiết thông số 3 cột */}
            <div className="row row-cols-3 g-3 mb-4">
              <div className="col">
                <div
                  className={`p-3 rounded-3 text-center border border-secondary border-opacity-25 ${styles.statBox}`}
                >
                  <i className="bi bi-check-lg text-success fs-3 d-block mb-1"></i>
                  <div className="fw-bold fs-4 text-white">{correctCount}</div>
                  <small className="text-light opacity-75">Câu đúng</small>
                </div>
              </div>

              <div className="col">
                <div
                  className={`p-3 rounded-3 text-center border border-secondary border-opacity-25 ${styles.statBox}`}
                >
                  <i className="bi bi-x-lg text-danger fs-3 d-block mb-1"></i>
                  <div className="fw-bold fs-4 text-white">{wrongCount}</div>
                  <small className="text-light opacity-75">Câu sai</small>
                </div>
              </div>

              <div className="col">
                <div
                  className={`p-3 rounded-3 text-center border border-secondary border-opacity-25 ${styles.statBox}`}
                >
                  <i className="bi bi-clock text-info fs-3 d-block mb-1"></i>
                  <div className="fw-bold fs-4 text-white">
                    {formatTime(timeTaken)}
                  </div>
                  <small className="text-light opacity-75">Thời gian</small>
                </div>
              </div>
            </div>

            {/* Nút Thao Tác */}
            <div className="d-flex flex-column flex-sm-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/history")}
                className="btn btn-outline-info fw-bold py-2 px-4 rounded-3 flex-fill"
              >
                <i className="bi bi-eye me-1"></i> Xem Lịch Sử Bài Làm
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onRetryExam) {
                    onRetryExam();
                  } else {
                    window.location.reload();
                  }
                }}
                className={`btn btn-primary fw-bold py-2 px-4 rounded-3 flex-fill shadow ${styles.btnRetry}`}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Thi Lại Bài Này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};