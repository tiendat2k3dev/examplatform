"use client";

import { useState } from "react";

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

  if (!show) {
    return null;
  }

  // =========================
  // THÊM
  // =========================
  const handleCreate = () => {
    const allAnswers: AnswerOption[] = (
      Object.keys(answers) as Array<"A" | "B" | "C" | "D">
    ).map((key) => ({
      key,
      value: answers[key].trim(),
    }));

    // Validate
    if (!question.trim()) {
      alert("Vui lòng nhập câu hỏi");
      return;
    }

    if (!category.trim()) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    if (allAnswers.some((item) => !item.value)) {
      alert("Vui lòng nhập đầy đủ đáp án");
      return;
    }

    // Gửi dữ liệu lên Questions
    onSubmit({
      question: question.trim(),
      category,
      answers: allAnswers,
      correctAnswer,
    });

    // Reset form
    setQuestion("");
    setCategory("");
    setCorrectAnswer("A");

    setAnswers({
      A: "",
      B: "",
      C: "",
      D: "",
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
              <h5 className="modal-title fw-bold">Tạo câu hỏi</h5>

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
                  placeholder="Nhập câu hỏi..."
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
                        name="correctAnswer"
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
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuestionModal;
