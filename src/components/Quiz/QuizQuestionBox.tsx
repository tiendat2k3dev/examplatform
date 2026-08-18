// src/components/Quiz/QuizQuestionBox.tsx
import React from "react";
import { Question } from "@/types/question";

interface QuizQuestionBoxProps {
  examTitle?: string;
  examId: string;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionIndex?: number;
  onSelectOption: (optionIndex: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const QuizQuestionBox = ({
  examTitle,
  examId,
  question,
  questionIndex,
  totalQuestions,
  selectedOptionIndex,
  onSelectOption,
  onPrev,
  onNext,
}: QuizQuestionBoxProps) => {
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div
      className="card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
        backdropFilter: "blur(15px)",
      }}
    >
      {/* Question Header */}
      <div className="card-header border-bottom border-secondary border-opacity-25 p-4 d-flex align-items-center justify-content-between bg-primary bg-opacity-10">
        <div>
          <span
            className="badge text-info border border-info px-3 py-2 rounded-pill fw-bold mb-1"
            style={{ backgroundColor: "rgba(13, 202, 240, 0.15)" }}
          >
            Môn thi: {examTitle || "Lập Trình"}
          </span>
          <h5 className="fw-bold text-white m-0 mt-1">Mã đề: {examId}</h5>
        </div>
        <span
          className="badge text-warning border border-warning px-3 py-2 rounded-pill fw-bold"
          style={{ backgroundColor: "rgba(255, 193, 7, 0.15)" }}
        >
          Câu hỏi {(questionIndex + 1).toString().padStart(2, "0")} /{" "}
          {totalQuestions.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Question Body */}
      <div className="card-body p-4 p-md-5">
        <h5 className="fw-bold lh-base text-white mb-4">
          Câu {questionIndex + 1}: {question.questionText ?? ""}
        </h5>

        {/* Đáp án trắc nghiệm */}
        <div className="d-flex flex-column gap-3 mb-4">
          {(question.options ?? []).map((optionText: string, index: number) => {
            const isSelected = selectedOptionIndex === index;
            return (
              <label
                key={index}
                onClick={() => onSelectOption(index)}
                className={`p-3 rounded-3 border d-flex align-items-center gap-3`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: isSelected
                    ? "rgba(13, 110, 253, 0.25)"
                    : "rgba(15, 23, 42, 0.6)",
                  borderColor: isSelected
                    ? "rgba(13, 202, 240, 0.8)"
                    : "rgba(108, 117, 125, 0.4)",
                }}
              >
                <input
                  className="form-check-input flex-shrink-0"
                  type="radio"
                  name={`question-${question.id}`}
                  checked={isSelected}
                  onChange={() => onSelectOption(index)}
                />
                <span
                  className={`text-white ${isSelected ? "fw-semibold" : ""}`}
                >
                  {optionLabels[index]}. {optionText}
                </span>
              </label>
            );
          })}
        </div>

        {/* Điều hướng Câu tiếp / Câu trước */}
        <div className="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={questionIndex === 0}
            className="btn btn-outline-light rounded-3 px-4"
          >
            <i className="bi bi-arrow-left me-1"></i> Câu Trước
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={questionIndex === totalQuestions - 1}
            className="btn btn-primary fw-bold px-4 rounded-3"
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
              border: "none",
            }}
          >
            Câu Tiếp Theo <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};