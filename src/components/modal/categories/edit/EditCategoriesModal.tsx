"use client";

import { useEffect } from "react";
import { Modal } from "bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EditCategoriesModalProps {
  show: boolean;
  categoryName: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Vui lòng nhập tên danh mục")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
});

const EditCategoriesModal = ({
  show,
  categoryName,
  onClose,
  onSubmit,
}: EditCategoriesModalProps) => {
  useEffect(() => {
    const modalElement = document.getElementById("editCategoryModal");

    if (!modalElement) return;

    const modal = Modal.getOrCreateInstance(modalElement);

    if (show) {
      modal.show();
    } else {
      modal.hide();
    }

    const handleHidden = () => {
      onClose();
    };

    modalElement.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [show, onClose]);

  return (
    <div
      className="modal fade"
      id="editCategoryModal"
      tabIndex={-1}
      aria-labelledby="editCategoryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editCategoryModalLabel">
              Sửa danh mục
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <Formik
            enableReinitialize
            initialValues={{
              name: categoryName,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit(values.name.trim());
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="editCategoryName"
                      className="form-label fw-semibold"
                    >
                      Tên danh mục
                    </label>

                    <Field
                      id="editCategoryName"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên danh mục"
                    />

                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Hủy
                  </button>

                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={isSubmitting}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditCategoriesModal;
