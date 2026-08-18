"use client";

import { useEffect, useState } from "react";
import type { EditExam } from "@/types/exam";
import { getCategoriesService } from "@/services/categories";
import type { Category } from "@/types/categories";

/** Props cho DeleteExamModal */
interface DeleteExamModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  exam: EditExam | null;
}

/**
 * DeleteExamModal – modal xác nhận xóa đề thi.
 */
const DeleteExamModal = ({
  show,
  onClose,
  onConfirm,
  exam,
}: DeleteExamModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategoriesService()
      .then(setCategories)
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  if (!show || !exam) return null;

  const categoryName =
    categories.find((c) => c.id === exam.categoryId)?.name ?? exam.categoryId;

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
              <h5 className="modal-title fw-bold">Xóa đề thi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Bạn có chắc chắn muốn xóa đề thi này không?
              </p>

              <div className="mt-3 p-3 border rounded bg-light">
                <strong>{exam.name}</strong>
                <div className="text-secondary small mt-1">{categoryName}</div>
                <div className="text-secondary small">Mã: {exam.code}</div>
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

export default DeleteExamModal;
