"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateUserApiAsync } from "@/redux/reducers/AuthReducer";
import { toast } from "react-toastify";

interface UpdateProfileModalProps {
  show: boolean;
  onClose: () => void;
}

export default function UpdateProfileModal({
  show,
  onClose,
}: UpdateProfileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser, show]);

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.warning("Họ và tên không được để trống!");
      return;
    }

    if (!currentUser?.id) return;

    try {
      setLoading(true);
      await dispatch(
        updateUserApiAsync(currentUser.id, formData, () => {
          toast.success("Cập nhật thông tin hồ sơ thành công!");
          onClose();
        })
      );
    } catch {
      // Error handled by redux thunk
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content text-white rounded-4 border border-primary border-opacity-50 shadow-lg"
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
            backdropFilter: "blur(15px)",
          }}
        >
          <div className="modal-header border-secondary border-opacity-25 pb-2">
            <h5 className="modal-title fw-bold text-primary d-flex align-items-center gap-2">
              <i className="bi bi-pencil-square"></i> Cập Nhật Hồ Sơ Cá Nhân
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
              <div className="row g-3">
                {/* 1. Họ và tên */}
                <div className="col-md-6">
                  <label className="form-label text-light opacity-75 small">
                    Họ và tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="Nhập họ và tên đầy đủ..."
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                {/* 2. Email */}
                <div className="col-md-6">
                  <label className="form-label text-light opacity-75 small">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* 3. Số điện thoại */}
                <div className="col-md-6">
                  <label className="form-label text-light opacity-75 small">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="VD: 0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* 4. Địa chỉ */}
                <div className="col-md-6">
                  <label className="form-label text-light opacity-75 small">
                    Địa chỉ liên hệ
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control bg-dark text-white border-secondary border-opacity-50"
                    placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
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
                className="btn btn-primary fw-bold px-4"
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