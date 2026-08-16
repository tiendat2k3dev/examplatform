"use client";

import type { EditExam, ExamQuestion } from "@/types/exam";

interface ViewExamsProps {
  show: boolean;
  onClose: () => void;
  exam: EditExam | null;
  questions: ExamQuestion[];
}

const ViewExams = ({ show, onClose, exam, questions }: ViewExamsProps) => {
  if (!show || !exam) {
    return null;
  }

  const examQuestions = exam.questionIds
    ? questions.filter((q) => exam.questionIds!.includes(q.id))
    : [];

  const getStatusBadge = (status: EditExam["status"]) => {
    if (status === "Hoạt động") {
      return <span className="badge bg-success">✓ Hoạt động</span>;
    }

    return <span className="badge bg-danger">× Khóa</span>;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* Header */}
            <div
              className="modal-header text-white"
              style={{
                background: "linear-gradient(90deg, #25489f, #367ff0)",
              }}
            >
              <h5 className="modal-title fw-bold">Chi tiết đề thi</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Đóng"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row g-3 mb-4">
                {/* Mã đề */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Mã đề</div>

                    <div className="fw-semibold text-dark">{exam.id}</div>
                  </div>
                </div>

                {/* Danh mục */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Danh mục</div>

                    <div className="fw-semibold text-dark">
                      {exam.category}
                    </div>
                  </div>
                </div>

                {/* Số câu hỏi */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Số câu hỏi</div>

                    <div className="fw-semibold text-dark">
                      {exam.questions}
                    </div>
                  </div>
                </div>

                {/* Thời gian */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Thời gian</div>

                    <div className="fw-semibold text-dark">
                      {exam.duration} phút
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách câu hỏi */}
              {examQuestions.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-bold mb-3" style={{ color: "#173b69" }}>
                    Danh sách câu hỏi
                  </h6>

                  {examQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className="border rounded p-3 mb-3 bg-light"
                    >
                      <div className="fw-semibold text-dark mb-2">
                        {index + 1}. {q.content}
                      </div>

                      {q.answers && q.answers.length > 0 && (
                        <div className="row g-2">
                          {q.answers.map((ans) => (
                            <div key={ans.key} className="col-md-6">
                              <div
                                className={`p-2 border rounded small ${
                                  q.correctAnswer === ans.key
                                    ? "border-success bg-success bg-opacity-10 text-success fw-semibold"
                                    : "border-secondary bg-white"
                                }`}
                              >
                                <span className="me-1">{ans.key}.</span>
                                {ans.value}
                                {q.correctAnswer === ans.key && (
                                  <span className="ms-1">✓</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
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

export default ViewExams;
