"use client";

import { Question } from "@/types/question";

interface DeleteQuestionModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  question: Question | null;
}

const DeleteQuestionModal = ({
  show,
  onClose,
  onConfirm,
  question,
}: DeleteQuestionModalProps) => {
  if (!show || !question) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" onClick={onClose} />

      {/* MODAL */}
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* HEADER */}
            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #d92d20, #ef4444)",
              }}
            >
              <h5 className="modal-title fw-bold">Xóa câu hỏi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              <p className="mb-0">
                Bạn có chắc chắn muốn xóa câu hỏi này không?
              </p>

              <div className="mt-3 p-3 border rounded bg-light">
                <div className="fw-semibold">
                  {question.content || "Không có nội dung"}
                </div>

                <div className="text-secondary small mt-2">
                  Mã câu hỏi: {question.id}
                </div>

                <div className="text-secondary small mt-1">
                  Mã danh mục: {question.categoryId}
                </div>
              </div>

              <div className="alert alert-warning mt-3 mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Sau khi xóa, câu hỏi sẽ không thể khôi phục.
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Hủy
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirm}
              >
                <i className="bi bi-trash me-1"></i>
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteQuestionModal;
