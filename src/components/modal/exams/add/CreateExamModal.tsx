"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import type {
  CreateExamFormValues,
  ExamGroup,
  QuestionWithAnswers,
} from "@/types/exam";

/* =========================================================
   PROPS
========================================================= */

interface CreateExamModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (values: CreateExamFormValues) => Promise<void> | void;
  /** Danh sách câu hỏi từ ngân hàng */
  questions: QuestionWithAnswers[];
  /** Danh sách nhóm đề thi để chọn */
  examGroups: ExamGroup[];
}

/* =========================================================
   VALIDATION
   Dùng `categoryId` thay vì `category` để khớp với CreateExamFormValues
========================================================= */

const validationSchema = Yup.object({
  code: Yup.string()
    .trim()
    .required("Vui lòng nhập mã đề thi")
    .max(50, "Mã đề thi tối đa 50 ký tự"),

  name: Yup.string()
    .trim()
    .required("Vui lòng nhập tên đề thi")
    .max(200, "Tên đề thi tối đa 200 ký tự"),

  categoryId: Yup.string().required("Vui lòng chọn danh mục"),

  examGroupId: Yup.string().required("Vui lòng chọn nhóm đề thi"),

  duration: Yup.number()
    .typeError("Thời gian phải là số")
    .required("Vui lòng nhập thời gian")
    .min(1, "Thời gian phải lớn hơn 0")
    .max(600, "Thời gian tối đa 600 phút"),

  passScore: Yup.number()
    .typeError("Điểm phải là số")
    .required("Vui lòng nhập điểm pass")
    .min(0, "Điểm tối thiểu là 0")
    .max(10, "Điểm tối đa là 10"),

  status: Yup.string().oneOf(["Hoạt động", "Khóa"]).required(),

  questionIds: Yup.array()
    .of(Yup.string())
    .min(1, "Vui lòng chọn ít nhất 1 câu hỏi"),
});

/* =========================================================
   INITIAL VALUES
   Khớp hoàn toàn với CreateExamFormValues từ @/types/exam
========================================================= */

const initialValues: CreateExamFormValues = {
  code: "",
  name: "",
  categoryId: "",
  examGroupId: "",
  duration: 45,
  passScore: 5,
  status: "Hoạt động",
  questionIds: [],
};

/* =========================================================
   COMPONENT
========================================================= */

/**
 * CreateExamModal – modal tạo đề thi mới.
 *
 * Hiển thị form nhập thông tin đề thi và cho phép chọn câu hỏi
 * từ ngân hàng câu hỏi với tìm kiếm và phân trang.
 * Khi submit gọi `onCreate(values)`.
 */
const CreateExamModal = ({
  show,
  onClose,
  onCreate,
  questions,
  examGroups,
}: CreateExamModalProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  /* =======================================================
     FORMIK
  ======================================================= */

  const formik = useFormik<CreateExamFormValues>({
    initialValues,

    validationSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onCreate(values);
        toast.success("Tạo đề thi thành công!");
        resetForm();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Không thể tạo đề thi!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* =======================================================
     EFFECTS
  ======================================================= */

  useEffect(() => {
    if (!show) {
      setSearch("");
      setCurrentPage(1);
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =======================================================
     FILTERED QUESTIONS
  ======================================================= */

  const filteredQuestions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return questions;
    return questions.filter(
      (q) =>
        q.content.toLowerCase().includes(keyword) ||
        (q.categoryName ?? "").toLowerCase().includes(keyword),
    );
  }, [questions, search]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / pageSize),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + pageSize,
  );

  /* =======================================================
     QUESTION SELECTION HELPERS
  ======================================================= */

  const isSelected = (id: string) => formik.values.questionIds.includes(id);

  const handleSelectQuestion = (id: string) => {
    const currentIds = formik.values.questionIds;
    formik.setFieldValue(
      "questionIds",
      currentIds.includes(id)
        ? currentIds.filter((qId) => qId !== id)
        : [...currentIds, id],
    );
  };

  const allCurrentSelected =
    currentQuestions.length > 0 &&
    currentQuestions.every((q) => formik.values.questionIds.includes(q.id));

  const handleSelectAll = () => {
    const currentIds = currentQuestions.map((q) => q.id);
    if (allCurrentSelected) {
      formik.setFieldValue(
        "questionIds",
        formik.values.questionIds.filter((id) => !currentIds.includes(id)),
      );
    } else {
      formik.setFieldValue("questionIds", [
        ...new Set([...formik.values.questionIds, ...currentIds]),
      ]);
    }
  };

  /* =======================================================
     RENDER GUARD
  ======================================================= */

  if (!show) return null;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1055 }}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        style={{ maxWidth: "1200px" }}
      >
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold" style={{ color: "#173b69" }}>
                Thêm đề thi mới
              </h5>
              <small className="text-secondary">
                Tạo mới bài kiểm tra hoặc đề thi cho học viên.
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={formik.isSubmitting}
            />
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* =========================================
                    LEFT – Thông tin chung
                ========================================= */}
                <div className="col-lg-3">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-bold mb-4" style={{ color: "#173b69" }}>
                      Thông tin chung
                    </h6>

                    {/* Mã đề thi (code) */}
                    <div className="mb-3">
                      <label
                        htmlFor="create-code"
                        className="form-label small fw-semibold"
                      >
                        Mã đề thi <span className="text-danger">*</span>
                      </label>
                      <input
                        id="create-code"
                        name="code"
                        type="text"
                        className={`form-control form-control-sm ${
                          formik.touched.code && formik.errors.code
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="VD: TOAN01"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.code && formik.errors.code && (
                        <div className="invalid-feedback">
                          {formik.errors.code}
                        </div>
                      )}
                    </div>

                    {/* Tên đề thi */}
                    <div className="mb-3">
                      <label
                        htmlFor="create-name"
                        className="form-label small fw-semibold"
                      >
                        Tên đề thi <span className="text-danger">*</span>
                      </label>
                      <input
                        id="create-name"
                        name="name"
                        type="text"
                        className={`form-control form-control-sm ${
                          formik.touched.name && formik.errors.name
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Kiểm tra 15 phút Toán Đại số"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>

                    {/* Danh mục – field name="categoryId" */}
                    <div className="mb-3">
                      <label
                        htmlFor="create-categoryId"
                        className="form-label small fw-semibold"
                      >
                        Danh mục <span className="text-danger">*</span>
                      </label>
                      <select
                        id="create-categoryId"
                        name="categoryId"
                        className={`form-select form-select-sm ${
                          formik.touched.categoryId && formik.errors.categoryId
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Chọn danh mục</option>
                        <option value="Toán học">Toán học</option>
                        <option value="Vật lý">Vật lý</option>
                        <option value="Hóa học">Hóa học</option>
                        <option value="Sinh học">Sinh học</option>
                      </select>
                      {formik.touched.categoryId &&
                        formik.errors.categoryId && (
                          <div className="invalid-feedback">
                            {formik.errors.categoryId}
                          </div>
                        )}
                    </div>

                    {/* Nhóm đề thi */}
                    <div className="mb-3">
                      <label
                        htmlFor="create-examGroupId"
                        className="form-label small fw-semibold"
                      >
                        Nhóm đề thi <span className="text-danger">*</span>
                      </label>
                      <select
                        id="create-examGroupId"
                        name="examGroupId"
                        className={`form-select form-select-sm ${
                          formik.touched.examGroupId &&
                          formik.errors.examGroupId
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.examGroupId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Chọn nhóm đề thi</option>
                        {examGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.examGroupId &&
                        formik.errors.examGroupId && (
                          <div className="invalid-feedback">
                            {formik.errors.examGroupId}
                          </div>
                        )}
                    </div>

                    {/* Thời gian & Điểm pass */}
                    <div className="row g-2">
                      <div className="col-6">
                        <label
                          htmlFor="create-duration"
                          className="form-label small fw-semibold"
                        >
                          Thời gian (phút)
                        </label>
                        <input
                          id="create-duration"
                          name="duration"
                          type="number"
                          min={1}
                          className={`form-control form-control-sm ${
                            formik.touched.duration && formik.errors.duration
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.duration}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.duration && formik.errors.duration && (
                          <div className="invalid-feedback">
                            {formik.errors.duration}
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label
                          htmlFor="create-passScore"
                          className="form-label small fw-semibold"
                        >
                          Điểm để pass
                        </label>
                        <input
                          id="create-passScore"
                          name="passScore"
                          type="number"
                          min={0}
                          max={10}
                          step={0.5}
                          className={`form-control form-control-sm ${
                            formik.touched.passScore && formik.errors.passScore
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formik.values.passScore}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.passScore &&
                          formik.errors.passScore && (
                            <div className="invalid-feedback">
                              {formik.errors.passScore}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="mt-3">
                      <label className="form-label small fw-semibold">
                        Trạng thái
                      </label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            id="create-open"
                            type="radio"
                            name="status"
                            value="Hoạt động"
                            className="form-check-input"
                            checked={formik.values.status === "Hoạt động"}
                            onChange={formik.handleChange}
                          />
                          <label
                            htmlFor="create-open"
                            className="form-check-label small"
                          >
                            Mở đề
                          </label>
                        </div>

                        <div className="form-check">
                          <input
                            id="create-locked"
                            type="radio"
                            name="status"
                            value="Khóa"
                            className="form-check-input"
                            checked={formik.values.status === "Khóa"}
                            onChange={formik.handleChange}
                          />
                          <label
                            htmlFor="create-locked"
                            className="form-check-label small"
                          >
                            Khóa đề
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-primary py-2 mt-4 mb-0 small">
                      Đã chọn{" "}
                      <strong>{formik.values.questionIds.length}</strong> câu
                      hỏi
                    </div>
                  </div>
                </div>

                {/* =========================================
                    RIGHT – Ngân hàng câu hỏi
                ========================================= */}
                <div className="col-lg-9">
                  <div className="border rounded overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-light p-3 d-flex justify-content-between align-items-center gap-3">
                      <div>
                        <h6
                          className="fw-bold mb-1"
                          style={{ color: "#173b69" }}
                        >
                          Chọn câu hỏi từ ngân hàng
                        </h6>
                        <small className="text-secondary">
                          Đã chọn:{" "}
                          <strong>{formik.values.questionIds.length}</strong>{" "}
                          câu hỏi
                        </small>
                      </div>

                      <div
                        className="input-group input-group-sm"
                        style={{ maxWidth: "240px" }}
                      >
                        <span className="input-group-text bg-white">
                          <i className="bi bi-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tìm kiếm nội dung..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: "40px" }}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={allCurrentSelected}
                                onChange={handleSelectAll}
                              />
                            </th>
                            <th>Nội dung câu hỏi</th>
                            <th style={{ width: "110px" }}>Danh mục</th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentQuestions.length === 0 ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center text-secondary py-5"
                              >
                                Không tìm thấy câu hỏi
                              </td>
                            </tr>
                          ) : (
                            currentQuestions.map((question) => (
                              <tr key={question.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isSelected(question.id)}
                                    onChange={() =>
                                      handleSelectQuestion(question.id)
                                    }
                                  />
                                </td>
                                <td>
                                  <div
                                    className="small"
                                    title={question.content}
                                  >
                                    {question.content}
                                  </div>
                                </td>
                                <td className="small text-secondary">
                                  {question.categoryName}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center p-2 border-top">
                      <small className="text-secondary">
                        Hiển thị{" "}
                        {filteredQuestions.length === 0 ? 0 : startIndex + 1}-
                        {Math.min(
                          startIndex + pageSize,
                          filteredQuestions.length,
                        )}{" "}
                        trên tổng {filteredQuestions.length} câu hỏi
                      </small>

                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          disabled={safePage === 1}
                          onClick={() =>
                            setCurrentPage(Math.max(1, safePage - 1))
                          }
                        >
                          ‹
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            type="button"
                            className={`btn btn-sm ${
                              safePage === page ? "btn-primary" : "btn-light"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          disabled={safePage === totalPages}
                          onClick={() =>
                            setCurrentPage(Math.min(totalPages, safePage + 1))
                          }
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>

                  {formik.touched.questionIds && formik.errors.questionIds && (
                    <div className="text-danger small mt-2">
                      {formik.errors.questionIds as string}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={formik.isSubmitting}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2" />
                    Lưu đề thi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExamModal;
