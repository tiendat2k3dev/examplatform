// src/components/History/HistoryDetailModal.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { History } from "@/types/history";
import styles from "@/app/history/History.module.css";

interface HistoryDetailModalProps {
  history: History | null;
  onClose: () => void;
}

export const HistoryDetailModal = ({
  history,
  onClose,
}: HistoryDetailModalProps) => {
  const router = useRouter();

  if (!history) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")} phút`;
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

  return (
    <div className={`modal fade show d-block ${styles.modalBackdrop}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content text-white rounded-4 overflow-hidden shadow-lg ${styles.glassCard}`}>
          <div className="modal-header border-secondary border-opacity-25 p-4">
            <h5 className="modal-title fw-bold text-info">
              <i className="bi bi-file-earmark-check me-2"></i>
              Chi Tiết Lượt Thi
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="btn-close btn-close-white"
            ></button>
          </div>

          <div className="modal-body p-4">
            <h5 className="fw-bold text-white mb-3">
              {history.examTitle || `Mã đề: ${history.examId}`}
            </h5>

            <div className={`p-3 rounded-3 mb-3 ${styles.modalInfoBox}`}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light opacity-75">Điểm số (Thang 10):</span>
                <span className="fw-bold text-info fs-5">
                  {((history.score / 100) * 10).toFixed(1)} / 10
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light opacity-75">Số câu trả lời đúng:</span>
                <span className="fw-bold text-success">
                  {history.correctAnswersCount} / {history.totalQuestions}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light opacity-75">Thời gian hoàn thành:</span>
                <span className="text-white">{formatDuration(history.timeTaken)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-light opacity-75">Ngày nộp bài:</span>
                <span className="text-white">{formatDate(history.completedAt)}</span>
              </div>
            </div>

            <div className="d-grid mt-4">
              <button
                type="button"
                onClick={() => router.push(`/exam/${history.examId}`)}
                className={`btn btn-primary fw-bold py-2 rounded-3 shadow ${styles.btnGradient}`}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Thi Lại Đề Này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};