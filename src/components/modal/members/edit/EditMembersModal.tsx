"use client";

import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

interface Member {
  id: number;
  username: string;
  password: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  img: string;
  role: string;
  status: string;
}

interface EditMembersModalProps {
  show: boolean;
  member: Member | null;
  onClose: () => void;
  onUpdate: (member: Member) => void;
}

const validationSchema = Yup.object({
  username: Yup.string().trim().required("Vui lòng nhập tên đăng nhập"),
  fullName: Yup.string().trim().required("Vui lòng nhập họ tên"),
  address: Yup.string().trim().required("Vui lòng nhập địa chỉ"),
  phone: Yup.string().trim().required("Vui lòng nhập số điện thoại"),
  email: Yup.string()
    .trim()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  img: Yup.string().trim().required("Vui lòng chọn ảnh đại diện"),
  role: Yup.string().oneOf(["Admin", "Member"]).required(),
  status: Yup.string().oneOf(["Mở khóa", "Khóa"]).required(),
});

const EditMembersModal = ({
  show,
  member,
  onClose,
  onUpdate,
}: EditMembersModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(member?.img ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMemberImgRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (member?.img && member.img !== prevMemberImgRef.current) {
      prevMemberImgRef.current = member.img;
      setPreviewUrl(member.img);
    }
  }, [member?.img]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      formik.setFieldValue("img", objectUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: member?.username ?? "",
      fullName: member?.fullName ?? "",
      address: member?.address ?? "",
      phone: member?.phone ?? "",
      email: member?.email ?? "",
      img: member?.img ?? "",
      role: member?.role ?? "Member",
      status: member?.status ?? "Mở khóa",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!member) {
        return;
      }

      try {
        setSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 300));

        onUpdate({
          ...member,
          ...values,
        });

        toast.success("Cập nhật người dùng thành công!");
        resetForm();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Không thể cập nhật người dùng!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
  }, [show]);

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
        style={{ maxWidth: "800px" }}
      >
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold" style={{ color: "#173b69" }}>
              Chỉnh sửa người dùng
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            />
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
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

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
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

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">
                    Ảnh đại diện <span className="text-danger">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />

                  <div
                    className="d-flex align-items-center gap-3"
                    style={{ cursor: "pointer" }}
                    onClick={handleImageClick}
                  >
                    <div
                      className="border rounded d-flex align-items-center justify-content-center bg-light"
                      style={{
                        width: "64px",
                        height: "64px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i
                          className="bi bi-person text-muted"
                          style={{ fontSize: "32px" }}
                        ></i>
                      )}
                    </div>

                    <div>
                      <div className="small fw-semibold text-primary">
                        Chọn ảnh đại diện
                      </div>
                      <div className="small text-muted">
                        {previewUrl
                          ? previewUrl.startsWith("blob:")
                            ? "Đã chọn ảnh mới"
                            : "Đang dùng ảnh hiện tại"
                          : "Nhấn để chọn ảnh từ máy tính"}
                      </div>
                    </div>
                  </div>

                  {formik.touched.img && formik.errors.img && (
                    <div className="text-danger small mt-1">
                      {formik.errors.img}
                    </div>
                  )}
                </div>

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
                    <option value="Mở khóa">Mở khóa</option>
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

export default EditMembersModal;
