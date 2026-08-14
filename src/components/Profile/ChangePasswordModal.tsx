"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { changePasswordApiAsync } from "@/redux/reducers/AuthReducer";
import styles from "./ChangePasswordModal.module.css";

interface ChangePasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  show,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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
      changePasswordApiAsync(currentUser.id, formData, () => {
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        onClose();
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
                    <i className="bi bi-shield-lock-fill fs-4"></i>
                  </div>
                  <div>
                    <h5
                      className={`modal-title fw-bold m-0 ${styles.titleGradient}`}
                    >
                      Cập Nhật Mật Khẩu
                    </h5>
                    <small className="text-light opacity-75">
                      Đổi mật khẩu để bảo vệ tài khoản
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
                <form id="changePasswordForm" onSubmit={handleSubmit}>
                  {/* Mật khẩu hiện tại */}
                  <div className="mb-3">
                    <label
                      htmlFor="oldPassword"
                      className="form-label small fw-bold text-light opacity-90"
                    >
                      Mật khẩu hiện tại <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                        id="oldPassword"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu hiện tại..."
                        required
                      />
                    </div>
                  </div>

                  {/* Mật khẩu mới */}
                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className="form-label small fw-bold text-light opacity-90"
                    >
                      Mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới..."
                        required
                      />
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="mb-3">
                    <label
                      htmlFor="confirmNewPassword"
                      className="form-label small fw-bold text-light opacity-90"
                    >
                      Xác nhận mật khẩu mới{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info">
                        <i className="bi bi-shield-check"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control bg-transparent border-0 text-white shadow-none fs-6"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu mới..."
                        required
                      />
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
                  form="changePasswordForm"
                  className={`btn btn-primary fw-bold px-4 rounded-3 shadow ${styles.submitBtn}`}
                >
                  <i className="bi bi-key-fill me-1"></i>Đổi Mật Khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
