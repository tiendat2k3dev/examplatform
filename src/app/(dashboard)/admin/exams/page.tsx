"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import HeaderExams from "../../../../components/exams/HeaderExams";
import CreateExamModal from "../../../../components/modal/exams/add/CreateExamModal";
import EditExamModal from "../../../../components/modal/exams/edit/EditExamModal";
import DeleteExamModal from "../../../../components/modal/exams/delete/DeleteExamModal";
import ViewExams from "../../../../components/modal/exams/view/ViewExams";
import ConfirmModal from "../../../../components/modal/common/ConfirmModal";

import type {
  Exam,
  CreateExamFormValues,
  EditExam,
  QuestionWithAnswers,
} from "@/types/exam";

import { mapStatusToUI } from "@/types/exam";

import type { Category } from "@/types/categories";
import type { ExamGroup } from "@/types/examGroup";

import {
  getAdminExamsService,
  getAdminCategoriesService,
  getAdminExamGroupsService,
  getAdminQuestionsService,
  createAdminExamService,
  updateAdminExamService,
  deleteAdminExamService,
  toggleAdminExamStatusService,
  toEditExam,
} from "@/services/examAdminService";

/* =========================================================
   CONSTANTS
========================================================= */

const PAGE_SIZE = 10;

/* =========================================================
   COMPONENT
========================================================= */

/**
 * ExamManagement – trang quản lý đề thi dành cho admin.
 *
 * Chức năng:
 * - Fetch danh sách đề thi, danh mục, nhóm đề thi và ngân hàng câu hỏi từ API
 * - Hiển thị bảng đề thi với tìm kiếm, lọc danh mục / trạng thái và phân trang
 * - Tạo mới / chỉnh sửa / xóa đề thi qua modal
 * - Xem chi tiết đề thi (câu hỏi + đáp án)
 * - Bật / tắt trạng thái đề thi qua toggle có xác nhận
 */
const ExamManagement = () => {
  /* =======================================================
     DATA STATE
  ======================================================= */

  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [examGroups, setExamGroups] = useState<ExamGroup[]>([]);
  const [questionBank, setQuestionBank] = useState<QuestionWithAnswers[]>([]);

  /* loading / error cho lần fetch đầu */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     SEARCH / FILTER / PAGINATION
  ======================================================= */

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     MODALS
  ======================================================= */

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* =======================================================
     SELECTED / PENDING
  ======================================================= */

  const [selectedExam, setSelectedExam] = useState<EditExam | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  /* =======================================================
     FETCH INITIAL DATA
  ======================================================= */

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories và exam groups trước để build questionBank
      const [cats, groups] = await Promise.all([
        getAdminCategoriesService(),
        getAdminExamGroupsService(),
      ]);

      // Fetch exams và questions song song (cần cats để resolve categoryName)
      const [examList, questions] = await Promise.all([
        getAdminExamsService(),
        getAdminQuestionsService(cats),
      ]);

      setCategories(cats);
      setExamGroups(groups);
      setExams(examList);
      setQuestionBank(questions);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu. Kiểm tra kết nối đến API server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* =======================================================
     RESET PAGE KHI FILTER THAY ĐỔI
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, categoryFilter, statusFilter]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredExams = exams.filter((exam) => {
    const keyword = searchText.trim().toLowerCase();

    const matchText =
      !keyword ||
      exam.id.toLowerCase().includes(keyword) ||
      exam.code.toLowerCase().includes(keyword) ||
      exam.name.toLowerCase().includes(keyword);

    const matchCategory =
      !categoryFilter || exam.categoryId === categoryFilter;

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && exam.status === "ACTIVE") ||
      (statusFilter === "inactive" && exam.status === "INACTIVE");

    return matchText && matchCategory && matchStatus;
  });

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedExams = filteredExams.slice(startIndex, startIndex + PAGE_SIZE);

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => setShowCreateModal(true);

  /* =======================================================
     CREATE
  ======================================================= */

  /**
   * Gọi service tạo đề thi mới rồi prepend vào danh sách.
   * @param values - Giá trị form từ CreateExamModal
   */
  const handleCreateExam = async (values: CreateExamFormValues) => {
    const created = await createAdminExamService(values);
    setExams((prev) => [created, ...prev]);
    toast.success("Tạo đề thi thành công!");
    setShowCreateModal(false);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    if (!exam) return;
    setSelectedExam(toEditExam(exam));
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedExam(null);
  };

  /* =======================================================
     UPDATE
  ======================================================= */

  /**
   * Gọi service cập nhật đề thi rồi thay thế record trong danh sách.
   * @param examId - ID đề thi cần cập nhật
   * @param values - Giá trị form mới
   */
  const handleUpdateExam = async (
    examId: string,
    values: CreateExamFormValues,
  ) => {
    const updated = await updateAdminExamService(examId, values);
    setExams((prev) =>
      prev.map((exam) => (exam.id === examId ? updated : exam)),
    );
    toast.success("Cập nhật đề thi thành công!");
    setShowEditModal(false);
    setSelectedExam(null);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    if (!exam) return;
    setSelectedExam(toEditExam(exam));
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedExam(null);
  };

  /** Xác nhận xóa đề thi đang được chọn */
  const handleConfirmDelete = async () => {
    if (!selectedExam) return;
    await deleteAdminExamService(selectedExam.id);
    setExams((prev) => prev.filter((e) => e.id !== selectedExam.id));
    toast.success("Xóa đề thi thành công!");
    setShowDeleteModal(false);
    setSelectedExam(null);
  };

  /* =======================================================
     VIEW
  ======================================================= */

  const handleView = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    if (!exam) return;
    setSelectedExam(toEditExam(exam));
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setSelectedExam(null);
  };

  /* =======================================================
     STATUS BADGE + TOGGLE
  ======================================================= */

  /**
   * Render badge trạng thái kèm toggle switch.
   * @param status - Status DB hiện tại ("ACTIVE" | "INACTIVE")
   * @param id     - ID đề thi
   */
  const getStatusBadge = (status: Exam["status"], id: string) => {
    const isActive = status === "ACTIVE";

    return (
      <div
        className="form-check form-switch"
        style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={isActive}
          onChange={() => {
            setPendingToggleId(id);
            setShowConfirmModal(true);
          }}
          style={{ width: "44px", height: "22px", cursor: "pointer" }}
        />
        <span
          className={`badge ${isActive ? "bg-success" : "bg-danger"}`}
          style={{ fontSize: "0.75rem", minWidth: "90px", textAlign: "center" }}
        >
          {isActive ? "Mở bài thi" : "Khóa bài thi"}
        </span>
      </div>
    );
  };

  /** Xác nhận bật / tắt trạng thái đề thi */
  const handleConfirmToggle = async () => {
    if (!pendingToggleId) return;

    const exam = exams.find((e) => e.id === pendingToggleId);
    if (!exam) return;

    const newStatus = await toggleAdminExamStatusService(
      pendingToggleId,
      exam.status,
    );

    setExams((prev) =>
      prev.map((e) =>
        e.id === pendingToggleId ? { ...e, status: newStatus } : e,
      ),
    );

    toast.success(
      newStatus === "ACTIVE" ? "Đã mở bài thi!" : "Đã khóa bài thi!",
    );

    setPendingToggleId(null);
    setShowConfirmModal(false);
  };

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
    setPendingToggleId(null);
  };

  /**
   * Tiêu đề cho ConfirmModal toggle trạng thái.
   * @returns Chuỗi xác nhận phù hợp với trạng thái hiện tại
   */
  const getConfirmTitle = (): string => {
    if (!pendingToggleId) return "";
    const exam = exams.find((e) => e.id === pendingToggleId);
    if (!exam) return "";
    return exam.status === "ACTIVE"
      ? "Bạn có chắc muốn khóa bài thi này?"
      : "Bạn có chắc muốn mở bài thi này?";
  };

  /* =======================================================
     RENDER – LOADING / ERROR
  ======================================================= */

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <span className="ms-3 text-secondary">Đang tải danh sách đề thi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill" />
          <div>
            <strong>Lỗi:</strong> {error}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={fetchAll}
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER – MAIN
  ======================================================= */

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="bg-white p-4 rounded-3 shadow-sm">
        {/* =================================================
            HEADER
        ================================================= */}

        <HeaderExams
          title="Quản lý đề thi"
          description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
          add="Thêm"
          onAdd={handleAdd}
        />

        {/* =================================================
            SEARCH AND FILTER
        ================================================= */}

        <div className="row mb-4 g-3">
          {/* Search */}
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text border-0 bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Tìm kiếm theo mã, tên đề thi..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* Category – render từ API */}
          <div className="col-md-3">
            <select
              className="form-select border-0 bg-light"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="col-md-3">
            <select
              className="form-select border-0 bg-light"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Khóa</option>
            </select>
          </div>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="fw-bold text-dark">STT</th>
                <th className="fw-bold text-dark">Mã đề thi</th>
                <th className="fw-bold text-dark">Tên đề thi</th>
                <th className="fw-bold text-dark">Danh mục</th>
                <th className="fw-bold text-dark">Số câu hỏi</th>
                <th className="fw-bold text-dark">Thời gian thi</th>
                <th className="fw-bold text-dark">Trạng thái</th>
                <th className="fw-bold text-dark">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {pagedExams.length > 0 ? (
                pagedExams.map((exam, index) => {
                  // Resolve tên danh mục từ danh sách categories
                  const categoryName =
                    categories.find((c) => c.id === exam.categoryId)?.name ??
                    exam.categoryId;

                  return (
                    <tr key={exam.id} className="border-bottom">
                      <td className="text-secondary">
                        {startIndex + index + 1}
                      </td>
                      <td className="fw-bold text-primary">{exam.code}</td>
                      <td>{exam.name}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {categoryName}
                        </span>
                      </td>
                      <td>{exam.totalQuestions ?? 0}</td>
                      <td>{exam.duration} phút</td>
                      <td>{getStatusBadge(exam.status, exam.id)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {/* View */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary p-1"
                            title="Xem chi tiết"
                            onClick={() => handleView(exam.id)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary p-1"
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(exam.id)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger p-1"
                            title="Xóa"
                            onClick={() => handleDelete(exam.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                    Không có đề thi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-secondary small">
            Hiển thị{" "}
            {filteredExams.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, filteredExams.length)} trong tổng{" "}
            <strong>{filteredExams.length}</strong> đề thi
          </div>

          <nav aria-label="Phân trang">
            <ul className="pagination mb-0">
              <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${safePage === page ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ),
              )}

              <li
                className={`page-item ${safePage === totalPages ? "disabled" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, safePage + 1))
                  }
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ===================================================
          CREATE MODAL
      =================================================== */}

      <CreateExamModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateExam}
        questions={questionBank}
        examGroups={examGroups}
      />

      {/* ===================================================
          EDIT MODAL
      =================================================== */}

      <EditExamModal
        show={showEditModal}
        exam={selectedExam}
        questions={questionBank}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateExam}
        examGroups={examGroups}
      />

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      <DeleteExamModal
        show={showDeleteModal}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        exam={selectedExam}
      />

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      <ViewExams
        show={showViewModal}
        onClose={handleCloseView}
        exam={selectedExam}
        questions={questionBank}
      />

      {/* ===================================================
          CONFIRM TOGGLE MODAL
      =================================================== */}

      <ConfirmModal
        show={showConfirmModal}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmToggle}
        title={getConfirmTitle()}
      />
    </div>
  );
};

export default ExamManagement;
