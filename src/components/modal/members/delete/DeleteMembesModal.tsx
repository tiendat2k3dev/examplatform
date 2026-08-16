"use client";

import { toast } from "react-toastify";

import { User } from "@/types/user";

interface DeleteMembersModalProps {
  show: boolean;
  member: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteMembersModal = ({
  show,
  member,
  onClose,
  onConfirm,
}: DeleteMembersModalProps) => {
  if (!show || !member) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* Header */}
            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #d92d20, #ef4444)",
              }}
            >
              <h5 className="modal-title fw-bold">Xóa người dùng</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="mb-0">
                Bạn có chắc chắn muốn xóa người dùng này không?
              </p>

              <div className="mt-3 p-3 border rounded bg-light">
                <strong>{member.fullName}</strong>

                <div className="text-secondary small mt-1">{member.email}</div>
              </div>
            </div>

            {/* Footer */}
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
                onClick={async () => {
                  try {
                    await onConfirm();

                    toast.success("Xóa người dùng thành công!");

                    onClose();
                  } catch (error) {
                    console.error("Lỗi khi xóa người dùng:", error);

                    toast.error("Không thể xóa người dùng!");
                  }
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

export default DeleteMembersModal;
