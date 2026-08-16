"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { User } from "@/types/user";

interface EditMembersModalProps {
  show: boolean;
  member: User | null;
  onClose: () => void;
  onUpdate: (member: User) => void | Promise<void>;
}

// =========================
// VALIDATION
// =========================
const validationSchema = Yup.object({
  username: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),

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

// =========================
// COMPONENT
// =========================
const EditMembersModal = ({
  show,
  member,
  onClose,
  onUpdate,
}: EditMembersModalProps) => {
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: member?.username ?? "",
      fullName: member?.fullName ?? "",
      address: member?.address ?? "",
      phone: member?.phone ?? "",
      email: member?.email ?? "",
      role: member?.role ?? "Member",
      status: member?.status ?? "Mở",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      if (!member) {
        return;
      }

      try {
        setSubmitting(true);

        const updatedMember: User = {
          ...member,

          username: values.username.trim(),
          fullName: values.fullName.trim(),
          address: values.address.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          role: values.role,
          status: values.status,
        };

        await onUpdate(updatedMember);

        toast.success("Cập nhật người dùng thành công!");

        onClose();
      } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);

        toast.error("Không thể cập nhật người dùng!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // =========================
  // RESET FORM KHI ĐÓNG MODAL
  // =========================
  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
  }, [show]);

  // =========================
  // KHÔNG HIỂN THỊ MODAL
  // =========================
  if (!show || !member) {
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
          {/* =========================
              HEADER
          ========================= */}
          <div className="modal-header">
            <h5
              className="modal-title fw-bold"
              style={{
                color: "#173b69",
              }}
            >
              Chỉnh sửa người dùng
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={formik.isSubmitting}
            />
          </div>

          {/* =========================
              FORM
          ========================= */}
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* =========================
                    USERNAME
                ========================= */}
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
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.username && formik.errors.username && (
                    <div className="invalid-feedback">
                      {formik.errors.username}
                    </div>
                  )}
                </div>

                {/* =========================
                    FULL NAME
                ========================= */}
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
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="invalid-feedback">
                      {formik.errors.fullName}
                    </div>
                  )}
                </div>

                {/* =========================
                    EMAIL
                ========================= */}
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
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* =========================
                    PHONE
                ========================= */}
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
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>

                {/* =========================
                    ADDRESS
                ========================= */}
                <div className="col-md-12">
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
                    disabled={formik.isSubmitting}
                  />

                  {formik.touched.address && formik.errors.address && (
                    <div className="invalid-feedback">
                      {formik.errors.address}
                    </div>
                  )}
                </div>

                {/* =========================
                    ROLE
                ========================= */}
                <div className="col-md-6">
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
                    disabled={formik.isSubmitting}
                  >
                    <option value="Member">Member</option>

                    <option value="Admin">Admin</option>
                  </select>

                  {formik.touched.role && formik.errors.role && (
                    <div className="invalid-feedback">{formik.errors.role}</div>
                  )}
                </div>

                {/* =========================
                    STATUS
                ========================= */}
                <div className="col-md-6">
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
                    disabled={formik.isSubmitting}
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

            {/* =========================
                FOOTER
            ========================= */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMembersModal;
