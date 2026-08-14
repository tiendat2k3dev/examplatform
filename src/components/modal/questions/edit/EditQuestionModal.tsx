"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import questionSchema from "@/utils/questionsInput";

interface AnswerOption {
  key: "A" | "B" | "C" | "D";
  value: string;
}

interface Question {
  id: number;
  question: string;
  category: string;
  answers?: AnswerOption[];
  correctAnswer?: "A" | "B" | "C" | "D";
}

interface EditQuestionModalProps {
  show: boolean;
  onClose: () => void;

  onSubmit: (updatedQuestion: Question) => void;

  questionToEdit: Question | null;
}

const EditQuestionModal = ({
  show,
  onClose,
  onSubmit,
  questionToEdit,
}: EditQuestionModalProps) => {
  const formik = useFormik({
    initialValues: {
      question: "",
      category: "",
      answers: {
        A: "",
        B: "",
        C: "",
        D: "",
      },
      correctAnswer: "A" as "A" | "B" | "C" | "D",
    },
    validationSchema: questionSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const nextAnswers: AnswerOption[] = (
        Object.keys(values.answers) as Array<"A" | "B" | "C" | "D">
      ).map((key) => ({
        key,
        value: values.answers[key].trim(),
      }));

      onSubmit({
        ...questionToEdit!,

        question: values.question.trim(),

        category: values.category,

        answers: nextAnswers,

        correctAnswer: values.correctAnswer,
      });

      toast.success("Cập nhật câu hỏi thành công!");

      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    if (!questionToEdit) {
      return;
    }

    formik.setValues({
      question: questionToEdit.question,
      category: questionToEdit.category,
      answers: {
        A:
          questionToEdit.answers?.find((item) => item.key === "A")?.value ?? "",
        B:
          questionToEdit.answers?.find((item) => item.key === "B")?.value ?? "",
        C:
          questionToEdit.answers?.find((item) => item.key === "C")?.value ?? "",
        D:
          questionToEdit.answers?.find((item) => item.key === "D")?.value ?? "",
      },
      correctAnswer: questionToEdit.correctAnswer ?? "A",
    });
  }, [questionToEdit]);

  if (!show || !questionToEdit) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      formik.resetForm();
      onClose();
    }
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={handleBackdropClick}
      ></div>

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
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
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
              ></button>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="modal-body">
                <div className="mb-4">
                  <label className="form-label">
                    <span className="text-danger">*</span> Câu hỏi
                  </label>

                  <textarea
                    className={`form-control ${
                      formik.touched.question && formik.errors.question
                        ? "is-invalid"
                        : ""
                    }`}
                    rows={3}
                    autoFocus
                    {...formik.getFieldProps("question")}
                  />

                  {formik.touched.question && formik.errors.question && (
                    <div className="invalid-feedback">
                      {formik.errors.question}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <span className="text-danger">*</span> Danh mục
                  </label>

                  <select
                    className={`form-select ${
                      formik.touched.category && formik.errors.category
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("category")}
                  >
                    <option value="">Chọn danh mục</option>

                    <option value="Toán">Toán</option>

                    <option value="Khoa học">Khoa học</option>

                    <option value="Lịch sử">Lịch sử</option>

                    <option value="Văn học">Văn học</option>

                    <option value="Geography">Geography</option>

                    <option value="Literature">Literature</option>

                    <option value="Science">Science</option>

                    <option value="History">History</option>
                  </select>

                  {formik.touched.category && formik.errors.category && (
                    <div className="invalid-feedback">
                      {formik.errors.category}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Đáp án</label>

                  {(["A", "B", "C", "D"] as const).map((option) => (
                    <div
                      key={option}
                      className="d-flex align-items-center mb-2"
                    >
                      <div
                        className="form-check me-2"
                        style={{ minWidth: "44px" }}
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

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    formik.resetForm();
                    onClose();
                  }}
                >
                  Hủy
                </button>

                <button type="submit" className="btn btn-primary">
                  Lưu
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
