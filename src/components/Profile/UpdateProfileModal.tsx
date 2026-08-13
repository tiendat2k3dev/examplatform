"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { updateUserApiAsync } from "@/redux/reducers/AuthReducer";
import styles from "./UpdateProfileModal.module.css";

interface UpdateProfileModalProps {
  show: boolean;
  onClose: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  show,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // State form lưu thông tin cập nhật
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Đồng bộ dữ liệu của currentUser vào form khi mở modal hoặc khi currentUser thay đổi
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  if (!show) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    dispatch(
      updateUserApiAsync(currentUser.id, formData, () => {
        onClose(); // Đóng modal sau khi cập nhật thành công
      }),
    );
  };

  return (
    <div className={styles.modalOverlay}>
      {/* Vòng tròn phát sáng trang trí nền */}
      <div
        className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle}`}
      ></div>

      <div className="container position-relative z-1">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div
              className={`modal-content border border-primary border-opacity-50 text-white rounded-4 overflow-hidden shadow-lg ${styles.modalContentCard}`}
            >
              {/* Modal Header */}
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`p-2 px-3 rounded-circle text-info border border-info border-opacity-50 ${styles.iconHeaderBox}`}
                  >
                    <i className="bi bi-person-gear fs-4"></i>
                  </div>
                  <div>
                    <h5
                      className={`modal-title fw-bold m-0 ${styles.titleGradient}`}
                    >
                      Cập Nhật Thông Tin Cá Nhân
                    </h5>
                    <small className="text-light opacity-75">
                      Thay đổi thông tin chi tiết hồ sơ tài khoản
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 p-md-5">
                <form id="editProfileForm" onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Username (Read-only) */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-light opacity-90">
                        Tên đăng nhập (Cố định)
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-25 ${styles.readOnlyInputBox}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-secondary">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control bg-transparent border-0 text-secondary shadow-none fs-6"
                          value={currentUser?.username || ""}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="col-md-6">
                      <label
                        htmlFor="fullName"
                        className="form-label small fw-bold text-light opacity-90"
                      >
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info">
                          <i className="bi bi-card-heading"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên..."
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label
                        htmlFor="email"
                        className="form-label small fw-bold text-light opacity-90"
                      >
                        Địa chỉ Email <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email..."
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label
                        htmlFor="phone"
                        className="form-label small fw-bold text-light opacity-90"
                      >
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại..."
                          required
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label
                        htmlFor="address"
                        className="form-label small fw-bold text-light opacity-90"
                      >
                        Địa chỉ liên hệ <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Nhập địa chỉ..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top border-secondary border-opacity-25 p-3 px-4">
                <button
                  type="button"
                  className="btn btn-outline-light rounded-3 px-4"
                  onClick={onClose}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  form="editProfileForm"
                  className={`btn btn-primary fw-bold px-4 rounded-3 shadow ${styles.submitBtn}`}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
