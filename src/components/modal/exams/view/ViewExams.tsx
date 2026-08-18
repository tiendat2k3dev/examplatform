"use client";

import { useEffect, useState } from "react";
import type { EditExam, QuestionWithAnswers } from "@/types/exam";
import { getCategoriesService } from "@/services/categories";
import type { Category } from "@/types/categories";

interface ViewExamsProps {
  show: boolean;
  onClose: () => void;
  exam: EditExam | null;
  questions: QuestionWithAnswers[];
}

const ViewExams = ({ show, onClose, exam, questions }: ViewExamsProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch danh mục để resolve tên từ id
  useEffect(() => {
    getCategoriesService()
      .then(setCategories)
      .catch((err) => console.error("Lỗi tải danh mục:", err));
  }, []);

  if (!show || !exam) return null;

  // Resolve tên danh mục từ categoryId
  const categoryName =
    categories.find((c) => c.id === exam.categoryId)?.name ?? exam.categoryId;

  // Lọc câu hỏi thuộc đề thi
  const examQuestions = exam.questionIds
    ? questions.filter((q) => exam.questionIds!.includes(q.id))
    : [];

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
              style={{ background: "linear-gradient(90deg, #25489f, #367ff0)" }}
            >
              <h5 className="modal-title fw-bold">Chi tiết đề thi</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Đóng"
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row g-3 mb-4">
                {/* Mã đề – hiển thị code, không phải id */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Mã đề</div>
                    <div className="fw-semibold text-dark">{exam.code}</div>
                  </div>
                </div>

                {/* Danh mục – hiển thị tên, không phải id */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Danh mục</div>
                    <div className="fw-semibold text-dark">{categoryName}</div>
                  </div>
                </div>

                {/* Số câu hỏi */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Số câu hỏi</div>
                    <div className="fw-semibold text-dark">
                      {exam.questionIds?.length ?? 0}
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

                {/* Trạng thái */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Trạng thái</div>
                    <div className="fw-semibold">
                      {exam.status === "Hoạt động" ? (
                        <span className="badge bg-success">✓ Hoạt động</span>
                      ) : (
                        <span className="badge bg-danger">× Khóa</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Điểm pass */}
                <div className="col-md-6">
                  <div className="p-3 border rounded bg-light h-100">
                    <div className="text-secondary small mb-1">Điểm đạt</div>
                    <div className="fw-semibold text-dark">{exam.passScore}</div>
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
                    <div key={q.id} className="border rounded p-3 mb-3 bg-light">
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

              {examQuestions.length === 0 && (
                <div className="text-center text-secondary py-4">
                  <i className="bi bi-inbox fs-3 d-block mb-2" />
                  Đề thi chưa có câu hỏi nào
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
