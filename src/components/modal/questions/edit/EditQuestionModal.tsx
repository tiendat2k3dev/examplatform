"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import questionSchema from "@/utils/questionsInput";

import { Category } from "@/types/categories";

import {
  AnswerLabel,
  AnswerOption,
  Question,
  UpdateQuestionData,
} from "@/types/question";

interface EditQuestionModalProps {
  show: boolean;
  onClose: () => void;

  onSubmit: (id: string, data: UpdateQuestionData) => void | Promise<void>;

  questionToEdit: Question | null;

  categories: Category[];
}

// ======================================================
// COMPONENT
// ======================================================

const EditQuestionModal = ({
  show,
  onClose,
  onSubmit,
  questionToEdit,
  categories,
}: EditQuestionModalProps) => {
  // ====================================================
  // FORMIK
  // ====================================================

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

    enableReinitialize: true,

    onSubmit: async (values) => {
      if (!questionToEdit) {
        return;
      }

      try {
        // ==============================================
        // CHUYỂN OBJECT ANSWERS -> ARRAY
        // ==============================================

        const answers: AnswerOption[] = (
          ["A", "B", "C", "D"] as AnswerLabel[]
        ).map((key) => ({
          key,
          value: values.answers[key].trim(),
        }));

        // ==============================================
        // DATA UPDATE
        // ==============================================

        const data: UpdateQuestionData = {
          content: values.content.trim(),

          categoryId: values.categoryId,

          answers,

          correctAnswer: values.correctAnswer,
        };

        console.log("ID update:", questionToEdit.id);

        console.log("DATA update:", data);

        // ==============================================
        // GỌI PARENT
        // ==============================================

        await onSubmit(questionToEdit.id, data);

        // ==============================================
        // THÔNG BÁO
        // ==============================================

        toast.success("Cập nhật câu hỏi thành công!");

        // ==============================================
        // RESET
        // ==============================================

        formik.resetForm();

        // ==============================================
        // ĐÓNG
        // ==============================================

        onClose();
      } catch (error) {
        console.error("Lỗi khi cập nhật câu hỏi:", error);

        toast.error("Không thể cập nhật câu hỏi!");
      }
    },
  });

  // ====================================================
  // LOAD DATA QUESTION
  // ====================================================

  useEffect(() => {
    if (!questionToEdit) {
      return;
    }

    const answers = questionToEdit.answers || [];

    // -----------------------------------------------
    // TÌM ĐÁP ÁN ĐÚNG
    // -----------------------------------------------

    const correctAnswer =
      answers.find((answer) => answer.isCorrect)?.label || "A";

    // -----------------------------------------------
    // SET FORM
    // -----------------------------------------------

    formik.setValues({
      content: questionToEdit.content || "",

      categoryId: questionToEdit.categoryId || "",

      answers: {
        A: answers.find((answer) => answer.label === "A")?.content || "",

        B: answers.find((answer) => answer.label === "B")?.content || "",

        C: answers.find((answer) => answer.label === "C")?.content || "",

        D: answers.find((answer) => answer.label === "D")?.content || "",
      },

      correctAnswer: correctAnswer as AnswerLabel,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionToEdit]);

  // ====================================================
  // CLOSE
  // ====================================================

  const handleClose = () => {
    formik.resetForm();

    onClose();
  };

  // ====================================================
  // BACKDROP
  // ====================================================

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ====================================================
  // HIDE
  // ====================================================

  if (!show || !questionToEdit) {
    return null;
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <>
      {/* BACKDROP */}

      <div className="modal-backdrop fade show" onClick={handleBackdropClick} />

      {/* MODAL */}

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* ======================================
                HEADER
            ====================================== */}

            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #25489f, #367ff0)",
              }}
            >
              <h5 className="modal-title fw-bold">Sửa câu hỏi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
              />
            </div>

            {/* ======================================
                FORM
            ====================================== */}

            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                {/* ==================================
                    CÂU HỎI
                ================================== */}

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
                    placeholder="Nhập câu hỏi..."
                    {...formik.getFieldProps("content")}
                  />

                  {formik.touched.content && formik.errors.content && (
                    <div className="invalid-feedback">
                      {formik.errors.content}
                    </div>
                  )}
                </div>

                {/* ==================================
                    DANH MỤC
                ================================== */}

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

                {/* ==================================
                    ĐÁP ÁN
                ================================== */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">Đáp án</label>

                  {(["A", "B", "C", "D"] as AnswerLabel[]).map((option) => (
                    <div
                      key={option}
                      className="d-flex align-items-center mb-2"
                    >
                      {/* RADIO */}

                      <div
                        className="form-check me-2"
                        style={{
                          minWidth: "44px",
                        }}
                      >
                        <input
                          className="form-check-input"
                          type="radio"
                          name="editCorrectAnswer"
                          value={option}
                          checked={formik.values.correctAnswer === option}
                          onChange={() =>
                            formik.setFieldValue("correctAnswer", option)
                          }
                        />

                        <label className="form-check-label">{option}.</label>
                      </div>

                      {/* ANSWER INPUT */}

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

              {/* ======================================
                  FOOTER
              ====================================== */}

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
                  {formik.isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuestionModal;
