"use client";
import { useEffect } from "react";
import { Modal } from "bootstrap";
interface DeleteCategoriesModalProps {
  show: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}
const DeleteCategoriesModal = ({
  show,
  categoryName,
  onClose,
  onConfirm,
}: DeleteCategoriesModalProps) => {
  useEffect(() => {
    const modalElement = document.getElementById("deleteCategoryModal");

    if (!modalElement) return;

    const modal = Modal.getOrCreateInstance(modalElement);

    if (show) {
      modal.show();
    } else {
      modal.hide();
    }

    const handleHidden = () => {
      onClose();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [show, onClose]);

  return (
    <div
      className="modal fade"
      id="deleteCategoryModal"
      tabIndex={-1}
      aria-labelledby="deleteCategoryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="deleteCategoryModalLabel">
              Xóa danh mục
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <p className="mb-0">
              Bạn có chắc chắn muốn xóa danh mục <strong>{categoryName}</strong>{" "}
              không?
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Hủy
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoriesModal;
