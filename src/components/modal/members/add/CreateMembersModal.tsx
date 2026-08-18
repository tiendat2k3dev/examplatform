"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { User } from "@/types/user";
import {
  checkUsernameExists,
  checkEmailExists,
  checkPhoneExists,
} from "@/services/userService";
interface CreateMembersModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (member: User) => Promise<void> | void;
}

const validationSchema = Yup.object({
  // 3–30 ký tự, chỉ chữ/số/gạch dưới, không khoảng trắng
  username: Yup.string()
    .trim()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới (_), không có khoảng trắng",
    )
    // ✅ Kiểm tra trùng tên đăng nhập thời gian thực (trên blur)
    .test("unique-username", "Tên đăng nhập đã tồn tại!", async (value) => {
      if (!value || value.trim().length < 3) return true;

      return !(await checkUsernameExists(value));
    }),

  // 6–50 ký tự
  password: Yup.string()
    .trim()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(50, "Mật khẩu tối đa 50 ký tự"),

  // 2–100 ký tự, cho phép chữ tiếng Việt và khoảng trắng
  fullName: Yup.string()
    .trim()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),

  // Đúng định dạng email
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập email")
    .email("Email không đúng định dạng")
    // ✅ Kiểm tra trùng email thời gian thực (trên blur)
    .test("unique-email", "Email đã tồn tại!", async (value) => {
      if (!value || !value.trim()) return true;

      return !(await checkEmailExists(value));
    }),

  // 10 số, bắt đầu bằng 0
  phone: Yup.string()
    .trim()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^0\d{9}$/, "Số điện thoại phải có 10 số và bắt đầu bằng 0")
    // ✅ Kiểm tra trùng số điện thoại thời gian thực (trên blur)
    .test("unique-phone", "Số điện thoại đã tồn tại!", async (value) => {
      if (!value || value.trim().length < 10) return true;

      return !(await checkPhoneExists(value));
    }),

  // 5–255 ký tự
  address: Yup.string()
    .trim()
    .required("Vui lòng nhập địa chỉ")
    .min(5, "Địa chỉ tối thiểu 5 ký tự")
    .max(255, "Địa chỉ tối đa 255 ký tự"),

  role: Yup.string()
    .oneOf(["Admin", "Member"], "Vui lòng chọn vai trò hợp lệ")
    .required("Vui lòng chọn vai trò"),

  status: Yup.string()
    .oneOf(["Mở", "Khóa"], "Vui lòng chọn trạng thái hợp lệ")
    .required("Vui lòng chọn trạng thái"),
});

const CreateMembersModal = ({
  show,
  onClose,
  onCreate,
}: CreateMembersModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

                  <div className="input-group input-group-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Nhập mật khẩu"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                      />
                    </button>

                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
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
