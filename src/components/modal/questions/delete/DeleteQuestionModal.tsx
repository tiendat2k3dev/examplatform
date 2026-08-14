"use client";

import { toast } from "react-toastify";

interface Question {
  id: number;
  question: string;
  category: string;
}

interface DeleteQuestionModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
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
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Bạn có chắc chắn muốn xóa câu hỏi này không?
              </p>

              <div className="mt-3 p-3 border rounded bg-light">
                <strong>{question.question}</strong>
                <div className="text-secondary small mt-1">
                  {question.category}
                </div>
              </div>
            </div>

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
                onClick={() => {
                  onConfirm();
                  toast.success("Xóa câu hỏi thành công!");
                  onClose();
                }}
              >
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
