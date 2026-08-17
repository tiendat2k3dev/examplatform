"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import type { ExamGroup } from "../../../../types/examGroup";
import { renderExamGroupIcon } from "../../../../utils/examGroupIcon";

interface AddProps {
  show: boolean;
  onClose: () => void;
  onCreate: (group: Omit<ExamGroup, "id">) => void | Promise<void>;
}

const initialValues = {
  name: "",
  description: "",
  icon: "bi bi-cup-hot-fill",
  iconClass: "bg-primary-subtle text-primary",
};

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Vui lòng nhập tên nhóm đề thi"),

  description: Yup.string().trim().required("Vui lòng nhập mô tả"),

  icon: Yup.string().trim().required("Vui lòng nhập icon"),

  iconClass: Yup.string().trim().required("Vui lòng chọn màu icon"),
});

const colorOptions = [
  {
    value: "bg-primary-subtle text-primary",
    label: "Xanh dương",
  },
  {
    value: "bg-success-subtle text-success",
    label: "Xanh lá",
  },
  {
    value: "bg-danger-subtle text-danger",
    label: "Đỏ",
  },
  {
    value: "bg-warning-subtle text-warning",
    label: "Cam",
  },
  {
    value: "bg-info-subtle text-info",
    label: "Xanh cyan",
  },
  {
    value: "bg-secondary-subtle text-secondary",
    label: "Xám",
  },
];

const Add = ({ show, onClose, onCreate }: AddProps) => {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);

        await onCreate({
          name: values.name,
          description: values.description,
          icon: values.icon,
          color: values.iconClass,
        });

        resetForm();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Không thể thêm nhóm đề thi!");
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
        style={{ maxWidth: "600px" }}
      >
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold" style={{ color: "#173b69" }}>
              Thêm nhóm đề thi
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
                {/* Tên */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Tên nhóm đề thi <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    className={`form-control form-control-sm ${
                      formik.touched.name && formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập tên nhóm đề thi"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

                {/* Mô tả */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Mô tả <span className="text-danger">*</span>
                  </label>

                  <textarea
                    name="description"
                    rows={3}
                    className={`form-control form-control-sm ${
                      formik.touched.description && formik.errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Nhập mô tả nhóm đề thi"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.description && formik.errors.description && (
                    <div className="invalid-feedback">
                      {formik.errors.description}
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Icon Bootstrap <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className={formik.values.icon}></i>
                    </span>

                    <input
                      type="text"
                      name="icon"
                      className={`form-control form-control-sm ${
                        formik.touched.icon && formik.errors.icon
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="VD: bi bi-cup-hot-fill"
                      value={formik.values.icon}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {formik.touched.icon && formik.errors.icon && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.icon}
                    </div>
                  )}

                  <div className="form-text">
                    Ví dụ: <code>bi bi-cup-hot-fill</code>,{" "}
                    <code>bi bi-database-fill</code>,{" "}
                    <code>bi bi-code-slash</code>
                  </div>
                </div>

                {/* Màu */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Màu icon <span className="text-danger">*</span>
                  </label>

                  <select
                    name="iconClass"
                    className={`form-select form-select-sm ${
                      formik.touched.iconClass && formik.errors.iconClass
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.iconClass}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {formik.touched.iconClass && formik.errors.iconClass && (
                    <div className="invalid-feedback">
                      {formik.errors.iconClass}
                    </div>
                  )}
                </div>

                {/* Preview */}
                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Xem trước
                  </label>

                  <div
                    className={`d-flex align-items-center justify-content-center rounded ${formik.values.iconClass}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "24px",
                    }}
                  >
                    {renderExamGroupIcon(formik.values.icon)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
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

export default Add;
