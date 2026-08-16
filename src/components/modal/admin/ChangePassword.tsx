"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (values: ChangePasswordValues) => Promise<void>;
}

const changePasswordSchema = Yup.object({
  // Mật khẩu hiện tại
  oldPassword: Yup.string().required("Mật khẩu hiện tại không được để trống"),

  // Mật khẩu mới
  newPassword: Yup.string()
    .required("Mật khẩu mới không được để trống")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu mới không được vượt quá 100 ký tự")
    .test(
      "different-from-old",
      "Mật khẩu mới phải khác mật khẩu hiện tại",
      function (value) {
        const { oldPassword } = this.parent;

        if (!value || !oldPassword) {
          return true;
        }

        return value !== oldPassword;
      },
    ),

  // Xác nhận mật khẩu mới
  confirmNewPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu mới")
    .oneOf([Yup.ref("newPassword")], "Hai mật khẩu mới không khớp nhau"),
});

const ChangePassword = ({ show, onClose, onSubmit }: ChangePasswordProps) => {
  // =========================
  // STATE HIỆN / ẨN MẬT KHẨU
  // =========================
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================
  // KHÓA SCROLL KHI MODAL MỞ
  // =========================
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // =========================
  // RESET HIỆN / ẨN KHI ĐÓNG
  // =========================
  useEffect(() => {
    if (!show) {
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <>
      {/* =========================
          MODAL
      ========================= */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <Formik<ChangePasswordValues>
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              }}
              validationSchema={changePasswordSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  // Gọi API / hàm đổi mật khẩu
                  await onSubmit(values);

                  // Chỉ chạy khi đổi mật khẩu thành công
                  toast.success("Đổi mật khẩu thành công!");

                  resetForm();

                  // Chỉ đóng modal khi thành công
                  onClose();
                } catch (error) {
                  console.error("Lỗi khi đổi mật khẩu:", error);

                  // =========================
                  // XỬ LÝ LỖI
                  // =========================
                  if (error instanceof Error) {
                    switch (error.message) {
                      case "OLD_PASSWORD_INCORRECT":
                        toast.error("Mật khẩu hiện tại không chính xác!");
                        break;

                      case "PASSWORD_SAME":
                        toast.error(
                          "Mật khẩu mới phải khác mật khẩu hiện tại!",
                        );
                        break;

                      case "PASSWORD_NOT_MATCH":
                        toast.error("Mật khẩu xác nhận không khớp!");
                        break;

                      default:
                        toast.error(error.message || "Đổi mật khẩu thất bại!");
                    }
                  } else {
                    toast.error("Đổi mật khẩu thất bại!");
                  }

                  // Không reset form
                  // Không đóng modal
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* =========================
                      HEADER
                  ========================= */}
                  <div className="modal-header">
                    <div>
                      <h5 className="modal-title fw-semibold mb-1">
                        Đổi mật khẩu
                      </h5>

                      <p className="text-muted small mb-0">
                        Thay đổi mật khẩu tài khoản của bạn
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={onClose}
                      aria-label="Close"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* =========================
                      BODY
                  ========================= */}
                  <div className="modal-body">
                    {/* MẬT KHẨU HIỆN TẠI */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Mật khẩu hiện tại
                      </label>

                      <div className="position-relative">
                        <Field
                          name="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          className="form-control pe-5"
                          placeholder="Nhập mật khẩu hiện tại"
                          disabled={isSubmitting}
                        />

                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-muted"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          disabled={isSubmitting}
                          tabIndex={-1}
                          aria-label={
                            showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                        >
                          <i
                            className={`bi ${
                              showOldPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </button>
                      </div>

                      <ErrorMessage
                        name="oldPassword"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* MẬT KHẨU MỚI */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Mật khẩu mới
                      </label>

                      <div className="position-relative">
                        <Field
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className="form-control pe-5"
                          placeholder="Nhập mật khẩu mới"
                          disabled={isSubmitting}
                        />

                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-muted"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          disabled={isSubmitting}
                          tabIndex={-1}
                          aria-label={
                            showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                        >
                          <i
                            className={`bi ${
                              showNewPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </button>
                      </div>

                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* XÁC NHẬN MẬT KHẨU */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Xác nhận mật khẩu mới
                      </label>

                      <div className="position-relative">
                        <Field
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control pe-5"
                          placeholder="Nhập lại mật khẩu mới"
                          disabled={isSubmitting}
                        />

                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-muted"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          disabled={isSubmitting}
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword
                              ? "Ẩn mật khẩu"
                              : "Hiện mật khẩu"
                          }
                        >
                          <i
                            className={`bi ${
                              showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </button>
                      </div>

                      <ErrorMessage
                        name="confirmNewPassword"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>

                    {/* NOTE */}
                    <div className="alert alert-light border small mb-0">
                      <i className="bi bi-shield-lock me-2" />
                      Mật khẩu mới phải có ít nhất 6 ký tự và không nên trùng
                      với mật khẩu hiện tại.
                    </div>
                  </div>

                  {/* =========================
                      FOOTER
                  ========================= */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-key me-2" />
                          Đổi mật khẩu
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* =========================
          BACKDROP
      ========================= */}
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default ChangePassword;
