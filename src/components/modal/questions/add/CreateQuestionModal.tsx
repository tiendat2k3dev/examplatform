"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";

import questionSchema from "@/utils/questionsInput";
import { Category } from "../../../../types/categories";
import {
  AnswerLabel,
  AnswerOption,
  CreateQuestionData,
} from "@/types/question";

interface CreateQuestionModalProps {
  show: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (question: CreateQuestionData) => void | Promise<void>;
}

const CreateQuestionModal = ({
  show,
  onClose,
  categories,
  onSubmit,
}: CreateQuestionModalProps) => {
  const formik = useFormik({
    initialValues: {
      content: "",
      categoryId: "",

      answers: {
        A: "",
        B: "",
        C: "",
        D: "",
      },

      correctAnswer: "A" as AnswerLabel,
    },

    validationSchema: questionSchema,

    onSubmit: async (values) => {
      try {
        const allAnswers: AnswerOption[] = (
          ["A", "B", "C", "D"] as AnswerLabel[]
        ).map((key) => ({
          key,
          value: values.answers[key].trim(),
        }));

        const questionData: CreateQuestionData = {
          content: values.content.trim(),
          categoryId: values.categoryId,
          answers: allAnswers,
          correctAnswer: values.correctAnswer,
        };

        await onSubmit(questionData);

        toast.success("Thêm câu hỏi thành công!");

        formik.resetForm();
        onClose();
      } catch (error) {
        console.error("Lỗi khi tạo câu hỏi:", error);

        toast.error("Không thể thêm câu hỏi!");
      }
    },
  });

  if (!show) {
    return null;
  }

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={handleBackdropClick} />

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #25489f, #367ff0)",
              }}
            >
              <h5 className="modal-title fw-bold">Tạo câu hỏi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
              />
            </div>

            {/* FORM */}

            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                {/* CÂU HỎI */}

                <div className="mb-4">
                  <label className="form-label">
                    <span className="text-danger">*</span> Câu hỏi
                  </label>

                  <textarea
                    className={`form-control ${
                      formik.touched.content && formik.errors.content
                        ? "is-invalid"
                        : ""
                    }`}
                    rows={3}
                    autoFocus
                    placeholder="Nhập câu hỏi..."
                    {...formik.getFieldProps("content")}
                  />

                  {formik.touched.content && formik.errors.content && (
                    <div className="invalid-feedback">
                      {formik.errors.content}
                    </div>
                  )}
                </div>

                {/* DANH MỤC */}

                <div className="mb-4">
                  <label className="form-label">
                    <span className="text-danger">*</span> Danh mục
                  </label>

                  <select
                    className={`form-select ${
                      formik.touched.categoryId && formik.errors.categoryId
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("categoryId")}
                  >
                    <option value="">Chọn danh mục</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {formik.touched.categoryId && formik.errors.categoryId && (
                    <div className="invalid-feedback">
                      {formik.errors.categoryId}
                    </div>
                  )}
                </div>

                {/* ĐÁP ÁN */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">Đáp án</label>

                  {(["A", "B", "C", "D"] as AnswerLabel[]).map((option) => (
                    <div
                      key={option}
                      className="d-flex align-items-center mb-2"
                    >
                      <div
                        className="form-check me-2"
                        style={{
                          minWidth: "44px",
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="correctAnswer"
                          value={option}
                          checked={formik.values.correctAnswer === option}
                          onChange={() =>
                            formik.setFieldValue("correctAnswer", option)
                          }
                        />

                        <label className="form-check-label">{option}.</label>
                      </div>

                      <input
                        type="text"
                        className={`form-control ${
                          formik.touched.answers?.[option] &&
                          formik.errors.answers?.[option]
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder={`Đáp án ${option}`}
                        {...formik.getFieldProps(`answers.${option}`)}
                      />
                    </div>
                  ))}

                  {formik.touched.answers && formik.errors.answers && (
                    <div className="text-danger small mt-1">
                      {Object.values(formik.errors.answers).join(" ")}
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClose}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Đang thêm..." : "Thêm câu hỏi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuestionModal;
