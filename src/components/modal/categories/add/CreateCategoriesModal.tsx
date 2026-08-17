"use client";

import { useEffect } from "react";
import { Modal } from "bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface CreateCategoriesModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (names: string[]) => void;
}

const validationSchema = Yup.object({
  name1: Yup.string()
    .trim()
    .required("Vui lòng nhập tên danh mục 1")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
  name2: Yup.string()
    .trim()
    .required("Vui lòng nhập tên danh mục 2")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
  name3: Yup.string()
    .trim()
    .required("Vui lòng nhập tên danh mục 3")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được quá 100 ký tự"),
});

const sampleCategories = [
  "Toán học",
  "Vật lý",
  "Hóa học",
];

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
              name1: sampleCategories[0],
              name2: sampleCategories[1],
              name3: sampleCategories[2],
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              const names = [
                values.name1.trim(),
                values.name2.trim(),
                values.name3.trim(),
              ].filter((name) => name.length > 0);

              onSubmit(names);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="createCategoryName1"
                      className="form-label fw-semibold"
                    >
                      Danh mục 1 <span className="text-danger">*</span>
                    </label>

                    <Field
                      id="createCategoryName1"
                      name="name1"
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên danh mục 1"
                    />

                    <ErrorMessage
                      name="name1"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="createCategoryName2"
                      className="form-label fw-semibold"
                    >
                      Danh mục 2 <span className="text-danger">*</span>
                    </label>

                    <Field
                      id="createCategoryName2"
                      name="name2"
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên danh mục 2"
                    />

                    <ErrorMessage
                      name="name2"
                      component="div"
                      className="text-danger mt-1 small"
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="createCategoryName3"
                      className="form-label fw-semibold"
                    >
                      Danh mục 3 <span className="text-danger">*</span>
                    </label>

                    <Field
                      id="createCategoryName3"
                      name="name3"
                      type="text"
                      className="form-control"
                      placeholder="Nhập tên danh mục 3"
                    />

                    <ErrorMessage
                      name="name3"
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