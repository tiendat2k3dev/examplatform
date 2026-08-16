"use client";

import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { User } from "@/types/user";

interface UpdateProfileValues {
  fullName: string;
  address: string;
  phone: string;
  email: string;
}

interface UpdateProfileProps {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (values: UpdateProfileValues) => void | Promise<void>;
}

const updateProfileSchema = Yup.object({
  fullName: Yup.string()
    .required("Họ và tên không được để trống")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự"),

  address: Yup.string()
    .required("Địa chỉ không được để trống")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự"),

  phone: Yup.string()
    .required("Số điện thoại không được để trống")
    .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),

  email: Yup.string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
});

const UpdateProfile = ({
  show,
  user,
  onClose,
  onSubmit,
}: UpdateProfileProps) => {
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

  if (!show || !user) {
    return null;
  }

  return (
    <>
      {/* MODAL */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <Formik<UpdateProfileValues>
              enableReinitialize
              initialValues={{
                fullName: user.fullName || "",
                address: user.address || "",
                phone: user.phone || "",
                email: user.email || "",
              }}
              validationSchema={updateProfileSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await onSubmit(values);

                  // Chỉ hiển thị 1 thông báo thành công
                  toast.success("Cập nhật thông tin thành công!");

                  // Đóng modal sau khi cập nhật thành công
                  onClose();
                } catch (error) {
                  console.error("Lỗi khi cập nhật thông tin cá nhân:", error);

                  // Chỉ hiển thị 1 thông báo lỗi
                  toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại!");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  {/* HEADER */}
                  <div className="modal-header">
                    <div>
                      <h5 className="modal-title fw-semibold mb-1">
                        Cập nhật thông tin
                      </h5>

                      <p className="text-muted small mb-0">
                        Cập nhật thông tin cá nhân của bạn
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

                  {/* BODY */}
                  <div className="modal-body">
                    <div className="row g-3">
                      {/* USERNAME */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Tên đăng nhập
                        </label>

                        <input
                          type="text"
                          className="form-control bg-light"
                          value={user.username || ""}
                          disabled
                        />

                        <div className="form-text">
                          Tên đăng nhập không thể thay đổi.
                        </div>
                      </div>

                      {/* FULL NAME */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Họ và tên
                        </label>

                        <Field
                          name="fullName"
                          type="text"
                          className="form-control"
                          placeholder="Nhập họ và tên"
                          disabled={isSubmitting}
                        />

                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* EMAIL */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium">Email</label>

                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="example@gmail.com"
                          disabled={isSubmitting}
                        />

                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* PHONE */}
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          Số điện thoại
                        </label>

                        <Field
                          name="phone"
                          type="text"
                          className="form-control"
                          placeholder="Nhập số điện thoại"
                          disabled={isSubmitting}
                        />

                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* ADDRESS */}
                      <div className="col-12">
                        <label className="form-label fw-medium">Địa chỉ</label>

                        <Field
                          name="address"
                          as="textarea"
                          rows={3}
                          className="form-control"
                          placeholder="Nhập địa chỉ"
                          disabled={isSubmitting}
                        />

                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
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
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2" />
                          Lưu thay đổi
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

      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default UpdateProfile;
