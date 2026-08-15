"use client";

import { useEffect } from "react";
import { Modal } from "bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface CreateCategoriesModalProps {
  show: boolean;
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

const CreateCategoriesModal = ({
  show,
  onClose,
  onSubmit,
}: CreateCategoriesModalProps) => {
  useEffect(() => {
    const modalElement = document.getElementById("createCategoryModal");

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
      id="createCategoryModal"
      tabIndex={-1}
      aria-labelledby="createCategoryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createCategoryModalLabel">
              Thêm danh mục
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <Formik
            initialValues={{
              name: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              onSubmit(values.name.trim());
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="createCategoryName"
                      className="form-label fw-semibold"
                    >
                      Tên danh mục
                    </label>

                    <Field
                      id="createCategoryName"
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
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Thêm
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

export default CreateCategoriesModal;
