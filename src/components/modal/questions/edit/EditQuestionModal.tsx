"use client";

import { useEffect, useState } from "react";

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
  const [question, setQuestion] = useState("");

  const [category, setCategory] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState<"A" | "B" | "C" | "D">(
    "A",
  );

  const [answers, setAnswers] = useState<Record<"A" | "B" | "C" | "D", string>>(
    {
      A: "",
      B: "",
      C: "",
      D: "",
    },
  );

  // =========================
  // LOAD DATA KHI BẤM SỬA
  // =========================
  useEffect(() => {
    if (!questionToEdit) {
      return;
    }

    // Câu hỏi
    setQuestion(questionToEdit.question);

    // Danh mục
    setCategory(questionToEdit.category);

    // Đáp án đúng
    setCorrectAnswer(questionToEdit.correctAnswer ?? "A");

    // Các đáp án
    setAnswers({
      A: questionToEdit.answers?.find((item) => item.key === "A")?.value ?? "",

      B: questionToEdit.answers?.find((item) => item.key === "B")?.value ?? "",

      C: questionToEdit.answers?.find((item) => item.key === "C")?.value ?? "",

      D: questionToEdit.answers?.find((item) => item.key === "D")?.value ?? "",
    });
  }, [questionToEdit]);

  if (!show || !questionToEdit) {
    return null;
  }

  // =========================
  // LƯU THAY ĐỔI
  // =========================
  const handleSave = () => {
    if (!question.trim()) {
      alert("Vui lòng nhập câu hỏi");
      return;
    }

    if (!category.trim()) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    const nextAnswers: AnswerOption[] = (
      Object.keys(answers) as Array<"A" | "B" | "C" | "D">
    ).map((key) => ({
      key,
      value: answers[key].trim(),
    }));

    if (nextAnswers.some((item) => !item.value)) {
      alert("Vui lòng nhập đầy đủ đáp án");
      return;
    }

    // Gửi dữ liệu đã sửa về Questions
    onSubmit({
      ...questionToEdit,

      question: question.trim(),

      category,

      answers: nextAnswers,

      correctAnswer,
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
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
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Câu hỏi */}
              <div className="mb-4">
                <label className="form-label">
                  <span className="text-danger">*</span> Câu hỏi
                </label>

                <textarea
                  className="form-control"
                  rows={3}
                  autoFocus
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              {/* Danh mục */}
              <div className="mb-4">
                <label className="form-label">
                  <span className="text-danger">*</span> Danh mục
                </label>

                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
              </div>

              {/* Đáp án */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Đáp án</label>

                {(["A", "B", "C", "D"] as const).map((option) => (
                  <div key={option} className="d-flex align-items-center mb-2">
                    {/* Radio */}
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
                        checked={correctAnswer === option}
                        onChange={() => setCorrectAnswer(option)}
                      />

                      <label className="form-check-label">{option}.</label>
                    </div>

                    {/* Input */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Đáp án ${option}`}
                      value={answers[option]}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [option]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditQuestionModal;
