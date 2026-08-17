// src/components/Sidebar/AvatarPreviewModal.tsx
import React from "react";

interface AvatarPreviewModalProps {
  show: boolean;
  avatarUrl: string;
  fullName: string;
  role?: string;
  onClose: () => void;
}

export const AvatarPreviewModal: React.FC<AvatarPreviewModalProps> = ({
  show,
  avatarUrl,
  fullName,
  role,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      onClick={onClose}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1070,
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "580px" }}
      >
        <div
          className="modal-content rounded-4 border border-secondary border-opacity-25 shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0b132b 0%, #1c2541 100%)",
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 p-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-image text-info fs-5"></i>
              <h6 className="modal-title fw-bold text-white m-0">Ảnh Đại Diện</h6>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body: Hiển thị trọn vẹn toàn bộ kích thước ảnh */}
          <div className="modal-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
            <div
              className="p-1 rounded-4 border border-info border-opacity-75 shadow-lg mb-3 d-flex align-items-center justify-content-center overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "360px",
                backgroundColor: "#080d1a",
                boxShadow: "0 0 25px rgba(0, 210, 255, 0.25)",
              }}
            >
              <img
                src={avatarUrl}
                alt={fullName}
                className="rounded-3"
                style={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <h5 className="fw-bold text-white mb-2">{fullName}</h5>
            <div>
              <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-25 rounded-pill px-3 py-1">
                <i className="bi bi-shield-check me-1"></i>
                {role || "Member"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};