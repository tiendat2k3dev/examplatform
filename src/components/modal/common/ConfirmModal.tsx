"use client";

interface ConfirmModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title,
}: ConfirmModalProps) => {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #25489f, #367ff0)",
              }}
            >
              <h5 className="modal-title fw-bold">Xác nhận</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <p className="mb-0">{title}</p>
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
                className="btn btn-primary"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
