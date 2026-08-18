"use client";

import { Question, Answer } from "@/types/question";
import { Category } from "@/types/categories";

interface ViewQuestionModalProps {
  show: boolean;
  onClose: () => void;
  question: Question | null;
  categories: Category[];
}

const ViewQuestionModal = ({
  show,
  onClose,
  question,
  categories,
}: ViewQuestionModalProps) => {
  if (!show || !question) {
    return null;
  }

  const answers: Answer[] = question.answers ?? [];

  const correctAnswer = answers.find((a) => a.isCorrect);

  const categoryName =
    categories.find((c) => c.id === question.categoryId)?.name ||
    question.category ||
    "Không xác định";

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #25489f, #367ff0)",
              }}
            >
              <h5 className="modal-title fw-bold">Chi tiết câu hỏi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-4">
                <div className="fw-semibold mb-2">Nội dung câu hỏi</div>
                <div className="border rounded p-3 bg-light">
                  {question.content || "Không có nội dung"}
                </div>
              </div>

              <div className="mb-4">
                <div className="fw-semibold mb-2">Danh mục</div>
                <div className="border rounded p-3 bg-light">
                  {categoryName}
                </div>
              </div>

              {correctAnswer && (
                <div className="mb-4">
                  <div className="fw-semibold mb-2">Đáp án đúng</div>
                  <div className="border rounded p-3 bg-success-subtle">
                    {correctAnswer.label}. {correctAnswer.content}
                  </div>
                </div>
              )}

              <div>
                <div className="fw-semibold mb-2">Danh sách phương án</div>

                <div className="d-flex flex-column gap-2">
                  {answers.length > 0 ? (
                    answers.map((answer) => {
                      const isCorrect = answer.isCorrect;

                      return (
                        <div
                          key={answer.id || answer.label}
                          className={`d-flex align-items-center justify-content-between border rounded p-3 ${
                            isCorrect
                              ? "bg-success-subtle border-success"
                              : "bg-light"
                          }`}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className={`badge rounded-pill ${
                                isCorrect ? "bg-success" : "bg-secondary"
                              }`}
                              style={{ minWidth: 32 }}
                            >
                              {answer.label}
                            </span>

                            <span>{answer.content}</span>
                          </div>

                          {isCorrect && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="border rounded p-3 bg-light text-secondary">
                      Chưa có đáp án
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewQuestionModal;
