"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateAvatarApiAsync } from "@/redux/reducers/AuthReducer";
import { toast } from "react-toastify";

interface UpdateAvatarModalProps {
  show: boolean;
  onClose: () => void;
}

export default function UpdateAvatarModal({
  show,
  onClose,
}: UpdateAvatarModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.avatarUrl) {
      setAvatarUrl(currentUser.avatarUrl);
    }
  }, [currentUser, show]);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarUrl.trim()) {
      toast.warning("Vui lòng nhập đường dẫn (URL) hình ảnh!");
      return;
    }

    if (!currentUser?.id) return;

    try {
      setLoading(true);
      await dispatch(
        updateAvatarApiAsync(currentUser.id, avatarUrl.trim(), () => {
          onClose();
        })
      );
    } catch {
      // Lỗi đã được toast trong thunk action
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1055 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content text-white rounded-4 border border-info border-opacity-50 shadow-lg"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div className="modal-header border-secondary border-opacity-25 pb-2">
            <h5 className="modal-title fw-bold text-info d-flex align-items-center gap-2">
              <i className="bi bi-camera-fill"></i> Cập Nhật Ảnh Đại Diện
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* KHUNG XEM TRƯỚC: Căn giữa tuyệt đối (d-flex + mx-auto) */}
              <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                <div
                  className="rounded-4 border border-info border-2 p-1 d-flex align-items-center justify-content-center overflow-hidden mb-2 shadow mx-auto"
                  style={{
                    width: "200px",
                    height: "140px",
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="w-100 h-100 rounded-3"
                      style={{ objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/200x140/1e293b/white?text=Error";
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-1 text-light opacity-50"></i>
                  )}
                </div>
                <small className="text-light opacity-50">Xem trước ảnh đại diện</small>
              </div>

              {/* Input URL */}
              <div className="mb-2">
                <label className="form-label text-light opacity-75 small">
                  Đường dẫn ảnh (URL)
                </label>
                <input
                  type="url"
                  className="form-control bg-dark text-white border-secondary border-opacity-50"
                  placeholder="https://example.com/my-avatar.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer border-secondary border-opacity-25 pt-2">
              <button
                type="button"
                className="btn btn-outline-secondary text-white"
                onClick={onClose}
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-info fw-bold px-4 text-dark"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}