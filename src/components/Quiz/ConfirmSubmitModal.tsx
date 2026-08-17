// src/components/Quiz/ConfirmSubmitModal.tsx
import React from "react";

interface ConfirmSubmitModalProps {
  show: boolean;
  answeredCount: number;
  totalQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({
  show,
  answeredCount,
  totalQuestions,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  const isUnfinished = answeredCount < totalQuestions;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content rounded-4 text-white border border-primary border-opacity-50 shadow-lg overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
            backdropFilter: "blur(15px)",
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className={`p-2 px-3 rounded-circle border ${
                  isUnfinished
                    ? "text-warning border-warning bg-warning bg-opacity-10"
                    : "text-info border-info bg-info bg-opacity-10"
                }`}
              >
                <i
                  className={`bi ${
                    isUnfinished ? "bi-exclamation-triangle-fill" : "bi-question-circle-fill"
                  } fs-4`}
                ></i>
              </div>
              <h5 className="modal-title fw-bold m-0 text-white">Xác Nhận Nộp Bài</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 text-center">
            {isUnfinished ? (
              <div className="alert alert-warning border border-warning text-dark text-start rounded-3 mb-3">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                Bạn mới chỉ hoàn thành <strong>{answeredCount}/{totalQuestions}</strong> câu hỏi. Các câu chưa chọn sẽ không có điểm!
              </div>
            ) : (
              <p className="fs-6 text-light opacity-90 mb-3">
                Bạn đã trả lời đầy đủ <strong>{answeredCount}/{totalQuestions}</strong> câu hỏi!
              </p>
            )}

            <p className="text-light opacity-75 m-0 small">
              Bạn có chắc chắn muốn nộp bài thi ngay bây giờ không?
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary border-opacity-25 p-3 px-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-light rounded-3 px-4 fw-semibold"
            >
              Làm Tiếp
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn btn-danger rounded-3 px-4 fw-bold shadow"
            >
              <i className="bi bi-send-check-fill me-1"></i> Xác Nhận Nộp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};