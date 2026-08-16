"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { User } from "@/types/user";

interface CreateMembersModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (member: User) => Promise<void> | void;
}

const validationSchema = Yup.object({
  username: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

  password: Yup.string().trim().required("Vui lòng nhập mật khẩu"),

  fullName: Yup.string().trim().required("Vui lòng nhập họ tên"),

  address: Yup.string().trim().required("Vui lòng nhập địa chỉ"),

  phone: Yup.string().trim().required("Vui lòng nhập số điện thoại"),

  email: Yup.string()
    .trim()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),

  role: Yup.string()
    .oneOf(["Admin", "Member"])
    .required("Vui lòng chọn vai trò"),

  status: Yup.string()
    .oneOf(["Mở", "Khóa"])
    .required("Vui lòng chọn trạng thái"),
});

const CreateMembersModal = ({
  show,
  onClose,
  onCreate,
}: CreateMembersModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
      role: "Member",
      status: "Mở",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);

        const newMember: User = {
          id: crypto.randomUUID(),
          username: values.username.trim(),
          password: values.password.trim(),
          fullName: values.fullName.trim(),
          address: values.address.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          role: values.role,
          status: values.status,
          createdAt: new Date().toISOString(),
          updatedAt: null,
        };

        // Gọi API / hàm tạo thành viên
        await onCreate(newMember);

        // ==============================
        // THÀNH CÔNG
        // ==============================

        toast.success("Thêm người dùng thành công!");

        // Reset form
        resetForm();

        // Đóng modal
        onClose();
      } catch (error) {
        console.error("Lỗi khi thêm người dùng:", error);

        // ==============================
        // XỬ LÝ LỖI - CHỈ HIỂN THỊ 1 THÔNG BÁO
        // ==============================

        if (error instanceof Error) {
          const errorMessage = error.message;

          if (errorMessage.includes("USERNAME_EXISTS")) {
            formik.setFieldError("username", "Tên đăng nhập đã tồn tại!");
          }

          if (errorMessage.includes("EMAIL_EXISTS")) {
            formik.setFieldError("email", "Email đã tồn tại!");
          }

          if (errorMessage.includes("PHONE_EXISTS")) {
            formik.setFieldError("phone", "Số điện thoại đã tồn tại!");
          }

          toast.error("Không thể thêm người dùng!");
        } else {
          toast.error("Không thể thêm người dùng!");
        }

        /*
         * QUAN TRỌNG:
         *
         * Không resetForm()
         * Không onClose()
         *
         * Modal vẫn mở để người dùng sửa dữ liệu.
         */
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==============================
  // RESET FORM KHI MODAL ĐÓNG
  // ==============================

  useEffect(() => {
    if (!show) {
      formik.resetForm();
      formik.setStatus(undefined);
    }
  }, [show]);

  // Không hiển thị modal
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1055,
      }}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        style={{
          maxWidth: "800px",
        }}
      >
        <div className="modal-content border-0 shadow">
          {/* =====================================
              HEADER
          ====================================== */}

          <div className="modal-header">
            <h5
              className="modal-title fw-bold"
              style={{
                color: "#173b69",
              }}
            >
              Thêm người dùng
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            />
          </div>

          {/* =====================================
              FORM
          ====================================== */}

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* =================================
                    USERNAME
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Tên đăng nhập <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="username"
                    className={`form-control form-control-sm ${
                      formik.touched.username && formik.errors.username
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập tên đăng nhập"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">
                      {formik.errors.username}
                    </div>
                  )}
                </div>

                {/* =================================
                    PASSWORD
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Mật khẩu <span className="text-danger">*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    className={`form-control form-control-sm ${
                      formik.touched.password && formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.password && formik.errors.password && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* =================================
                    FULL NAME
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Họ tên <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className={`form-control form-control-sm ${
                      formik.touched.fullName && formik.errors.fullName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập họ tên"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="invalid-feedback">
                      {formik.errors.fullName}
                    </div>
                  )}
                </div>

                {/* =================================
                    EMAIL
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    className={`form-control form-control-sm ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* =================================
                    PHONE
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Số điện thoại <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    className={`form-control form-control-sm ${
                      formik.touched.phone && formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập số điện thoại"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>

                {/* =================================
                    ADDRESS
                ================================== */}

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Địa chỉ <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="address"
                    className={`form-control form-control-sm ${
                      formik.touched.address && formik.errors.address
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập địa chỉ"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                {/* =================================
                    ROLE
                ================================== */}

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Vai trò <span className="text-danger">*</span>
                  </label>

                  <select
                    name="role"
                    className={`form-select form-select-sm ${
                      formik.touched.role && formik.errors.role
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>

                  {formik.touched.role && formik.errors.role && (
                    <div className="invalid-feedback">{formik.errors.role}</div>
                  )}
                </div>

                {/* =================================
                    STATUS
                ================================== */}

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">
                    Trạng thái <span className="text-danger">*</span>
                  </label>

                  <select
                    name="status"
                    className={`form-select form-select-sm ${
                      formik.touched.status && formik.errors.status
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="Mở">Mở</option>
                    <option value="Khóa">Khóa</option>
                  </select>

                  {formik.touched.status && formik.errors.status && (
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================
                FOOTER
            ====================================== */}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMembersModal;
