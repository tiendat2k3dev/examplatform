"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import questionSchema from "@/utils/questionsInput";

interface AnswerOption {
  key: "A" | "B" | "C" | "D";
  value: string;
}

interface CreateQuestionModalProps {
  show: boolean;
  onClose: () => void;

  onSubmit: (question: {
    question: string;
    category: string;
    answers: AnswerOption[];
    correctAnswer: "A" | "B" | "C" | "D";
  }) => void;
}

const CreateQuestionModal = ({
  show,
  onClose,
  onSubmit,
}: CreateQuestionModalProps) => {
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
    onSubmit: (values) => {
      const allAnswers: AnswerOption[] = (
        Object.keys(values.answers) as Array<"A" | "B" | "C" | "D">
      ).map((key) => ({
        key,
        value: values.answers[key].trim(),
      }));

      onSubmit({
        question: values.question.trim(),
        category: values.category,
        answers: allAnswers,
        correctAnswer: values.correctAnswer,
      });

      toast.success("Thêm câu hỏi thành công!");

      formik.resetForm();
      onClose();
    },
  });

  if (!show) {
    return null;
  }
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      formik.resetForm();
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
              <h5 className="modal-title fw-bold">Tạo câu hỏi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  onClose();
                  formik.resetForm();
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
                    placeholder="Nhập câu hỏi..."
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

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    onClose();
                    formik.resetForm();
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  Create
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
