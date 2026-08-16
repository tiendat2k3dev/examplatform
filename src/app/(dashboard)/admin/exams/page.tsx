"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import HeaderExams from "../../../../components/exams/HeaderExams";
import CreateExamModal from "../../../../components/modal/exams/add/CreateExamModal";
import EditExamModal from "../../../../components/modal/exams/edit/EditExamModal";
import DeleteExamModal from "../../../../components/modal/exams/delete/DeleteExamModal";
import ViewExams from "../../../../components/modal/exams/view/ViewExams";
import ConfirmModal from "../../../../components/modal/common/ConfirmModal";

import type {
  CreateExamFormValues,
  EditExam,
  ExamQuestion,
} from "@/types/exam";

interface Exam {
  id: string;
  name: string;
  category: string;
  questions: number;
  duration: number;
  status: "Hoạt động" | "Khóa";
  passScore: number;
  questionIds: string[];
  examGroupId?: string;
}

const questionBank: ExamQuestion[] = [
  {
    id: "Q001",
    content: "Giải phương trình bậc hai: x² - 5x + 6 = 0",
    category: "Toán học",
    answers: [
      { key: "A", value: "x = 1, x = 6" },
      { key: "B", value: "x = 2, x = 3" },
      { key: "C", value: "x = -2, x = -3" },
      { key: "D", value: "x = 0, x = 5" },
    ],
    correctAnswer: "B",
  },
  {
    id: "Q002",
    content:
      "Định luật II Newton mô tả mối quan hệ giữa lực và gia tốc như thế nào?",
    category: "Vật lý",
    answers: [
      { key: "A", value: "F = m/v" },
      { key: "B", value: "F = m × a" },
      { key: "C", value: "F = m + a" },
      { key: "D", value: "F = m - a" },
    ],
    correctAnswer: "B",
  },
  {
    id: "Q003",
    content: "Tính giá trị của biểu thức: 3/4 + 1/2",
    category: "Toán học",
    answers: [
      { key: "A", value: "1" },
      { key: "B", value: "1.25" },
      { key: "C", value: "1.5" },
      { key: "D", value: "2" },
    ],
    correctAnswer: "B",
  },
  {
    id: "Q004",
    content: "Công thức hóa học của Axit Sulfuric là gì?",
    category: "Hóa học",
    answers: [
      { key: "A", value: "HCl" },
      { key: "B", value: "H₂SO₄" },
      { key: "C", value: "NaOH" },
      { key: "D", value: "H₂O" },
    ],
    correctAnswer: "B",
  },
  {
    id: "Q005",
    content: "Tế bào là đơn vị cơ bản của sự sống. Phát biểu này đúng hay sai?",
    category: "Sinh học",
    answers: [
      { key: "A", value: "Đúng" },
      { key: "B", value: "Sai" },
      { key: "C", value: "Chưa xác định" },
      { key: "D", value: "Tùy trường hợp" },
    ],
    correctAnswer: "A",
  },
  {
    id: "Q006",
    content: "Tính đạo hàm của hàm số f(x) = x³ + 2x",
    category: "Toán học",
    answers: [
      { key: "A", value: "3x² + 2" },
      { key: "B", value: "x² + 2" },
      { key: "C", value: "3x + 2" },
      { key: "D", value: "x³ + 2" },
    ],
    correctAnswer: "A",
  },
  {
    id: "Q007",
    content: "Định luật bảo toàn năng lượng được phát biểu như thế nào?",
    category: "Vật lý",
    answers: [
      { key: "A", value: "Năng lượng có thể bị mất đi" },
      {
        key: "B",
        value: "Năng lượng có thể được tạo ra từ hư không",
      },
      {
        key: "C",
        value:
          "Năng lượng không thể tạo ra hay mất đi, chỉ chuyển hóa từ dạng này sang dạng khác",
      },
      { key: "D", value: "Năng lượng chỉ tồn tại dạng cơ năng" },
    ],
    correctAnswer: "C",
  },
  {
    id: "Q008",
    content: "Phản ứng giữa NaOH và HCl tạo ra sản phẩm gì?",
    category: "Hóa học",
    answers: [
      { key: "A", value: "NaCl + H₂O" },
      { key: "B", value: "NaCl + O₂" },
      { key: "C", value: "NaOH + HCl" },
      { key: "D", value: "Na + Cl + H₂O" },
    ],
    correctAnswer: "A",
  },
];

const initialExams: Exam[] = [
  {
    id: "EX001",
    name: "Đề thi Toán học cơ bản",
    category: "Toán học",
    questions: 3,
    duration: 30,
    status: "Hoạt động",
    passScore: 5,
    questionIds: ["Q001", "Q003", "Q006"],
    examGroupId: "grp-1",
  },
  {
    id: "EX002",
    name: "Đề thi Vật lý cơ bản",
    category: "Vật lý",
    questions: 2,
    duration: 30,
    status: "Hoạt động",
    passScore: 5,
    questionIds: ["Q002", "Q007"],
    examGroupId: "grp-2",
  },
  {
    id: "EX003",
    name: "Đề thi Hóa học cơ bản",
    category: "Hóa học",
    questions: 2,
    duration: 20,
    status: "Khóa",
    passScore: 5,
    questionIds: ["Q004", "Q008"],
    examGroupId: "grp-3",
  },
  {
    id: "EX004",
    name: "Đề thi Sinh học cơ bản",
    category: "Sinh học",
    questions: 1,
    duration: 15,
    status: "Hoạt động",
    passScore: 5,
    questionIds: ["Q005"],
    examGroupId: "grp-4",
  },
];

const examGroups = [
  { id: "grp-1", name: "Nhóm Toán học" },
  { id: "grp-2", name: "Nhóm Vật lý" },
  { id: "grp-3", name: "Nhóm Hóa học" },
  { id: "grp-4", name: "Nhóm Sinh học" },
];

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>(initialExams);

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("status");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [selectedExam, setSelectedExam] = useState<EditExam | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, category, sortBy]);

  const filteredExams = exams.filter((exam) => {
    const keyword = searchText.trim().toLowerCase();

    const matchText =
      !keyword ||
      exam.id.toLowerCase().includes(keyword) ||
      exam.name.toLowerCase().includes(keyword);

    const matchCategory = !category || exam.category === category;

    const matchStatus =
      sortBy === "status" ||
      (sortBy === "active" && exam.status === "Hoạt động") ||
      (sortBy === "locked" && exam.status === "Khóa");

    return matchText && matchCategory && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / 10));

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * 10;

  const pagedExams = filteredExams.slice(startIndex, startIndex + 10);

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (id: string) => {
    const exam = exams.find((item) => item.id === id);

    if (exam) {
      setSelectedExam({
        id: exam.id,
        name: exam.name,
        category: exam.category,
        examGroupId: exam.examGroupId,
        questions: exam.questions,
        duration: exam.duration,
        status: exam.status,
        passScore: exam.passScore,
        questionIds: exam.questionIds,
      });

      setShowEditModal(true);
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedExam(null);
  };

  const handleCreateExam = async (values: CreateExamFormValues) => {
    try {
      const newExam: Exam = {
        id: `EX${String(exams.length + 1).padStart(3, "0")}`,
        name: values.name,
        category: values.category,
        examGroupId: values.examGroupId,
        questions: values.questionIds.length,
        duration: values.duration,
        status: values.status,
        passScore: values.passScore,
        questionIds: values.questionIds,
      };

      setExams((prev) => [...prev, newExam]);

      toast.success("Tạo đề thi thành công!");

      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tạo đề thi!");
    }
  };

  const handleUpdateExam = async (
    examId: string,
    values: CreateExamFormValues,
  ) => {
    try {
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === examId
            ? {
                ...exam,
                name: values.name,
                category: values.category,
                examGroupId: values.examGroupId,
                questions: values.questionIds.length,
                duration: values.duration,
                status: values.status,
                passScore: values.passScore,
                questionIds: values.questionIds,
              }
            : exam,
        ),
      );

      toast.success("Cập nhật đề thi thành công!");

      setShowEditModal(false);
      setSelectedExam(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật đề thi!");
    }
  };

  const handleDelete = (id: string) => {
    const exam = exams.find((item) => item.id === id);

    if (exam) {
      setSelectedExam({
        id: exam.id,
        name: exam.name,
        category: exam.category,
        examGroupId: exam.examGroupId,
        questions: exam.questions,
        duration: exam.duration,
        status: exam.status,
        passScore: exam.passScore,
        questionIds: exam.questionIds,
      });

      setShowDeleteModal(true);
    }
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedExam(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExam) {
      return;
    }

    try {
      setExams((prev) => prev.filter((exam) => exam.id !== selectedExam.id));

      toast.success("Xóa đề thi thành công!");

      setShowDeleteModal(false);
      setSelectedExam(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa đề thi!");
    }
  };

  const handleView = (id: string) => {
    const exam = exams.find((item) => item.id === id);

    if (exam) {
      setSelectedExam({
        id: exam.id,
        name: exam.name,
        category: exam.category,
        examGroupId: exam.examGroupId,
        questions: exam.questions,
        duration: exam.duration,
        status: exam.status,
        passScore: exam.passScore,
        questionIds: exam.questionIds,
      });

      setShowViewModal(true);
    }
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setSelectedExam(null);
  };

  const getStatusBadge = (status: Exam["status"], id: string) => {
    const isActive = status === "Hoạt động";

    const handleToggle = () => {
      setPendingToggleId(id);
      setShowConfirmModal(true);
    };

    return (
      <div
        className="form-check form-switch"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={isActive}
          onChange={handleToggle}
          style={{
            width: "44px",
            height: "22px",
            cursor: "pointer",
          }}
        />

        <span
          className={`badge ${isActive ? "bg-success" : "bg-danger"}`}
          style={{
            fontSize: "0.75rem",
            minWidth: "90px",
            textAlign: "center",
          }}
        >
          {isActive ? "Mở bài thi" : "Khóa bài thi"}
        </span>
      </div>
    );
  };

  const handleConfirmToggle = async () => {
    if (!pendingToggleId) {
      return;
    }

    try {
      const exam = exams.find((e) => e.id === pendingToggleId);

      if (!exam) {
        return;
      }

      const newStatus = exam.status === "Hoạt động" ? "Khóa" : "Hoạt động";

      setExams((prev) =>
        prev.map((item) =>
          item.id === pendingToggleId
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );

      toast.success(
        newStatus === "Hoạt động" ? "Đã mở bài thi!" : "Đã khóa bài thi!",
      );
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật trạng thái!");
    } finally {
      setPendingToggleId(null);
      setShowConfirmModal(false);
    }
  };

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
    setPendingToggleId(null);
  };

  const getConfirmTitle = () => {
    if (!pendingToggleId) {
      return "";
    }

    const exam = exams.find((e) => e.id === pendingToggleId);

    if (!exam) {
      return "";
    }

    return exam.status === "Hoạt động"
      ? "Bạn có chắc muốn khóa bài thi này?"
      : "Bạn có chắc muốn mở bài thi này?";
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="bg-white p-4 rounded-3 shadow-sm">
        {/* Header */}
        <HeaderExams
          title="Quản lý đề thi"
          description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
          add="Thêm"
          onAdd={handleAdd}
        />

        {/* Search and Filters */}
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

          {/* Category */}
          <div className="col-md-3">
            <select
              className="form-select border-0 bg-light"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Chọn danh mục</option>
              <option value="Toán học">Toán học</option>
              <option value="Vật lý">Vật lý</option>
              <option value="Hóa học">Hóa học</option>
              <option value="Sinh học">Sinh học</option>
            </select>
          </div>

          {/* Status */}
          <div className="col-md-3">
            <select
              className="form-select border-0 bg-light"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="status">Chọn trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
                pagedExams.map((exam, index) => (
                  <tr key={exam.id} className="border-bottom">
                    <td>{startIndex + index + 1}</td>

                    {/* Mã đề thi */}
                    <td className="fw-bold text-primary">{exam.id}</td>

                    {/* Tên đề thi */}
                    <td>{exam.name}</td>

                    {/* Danh mục */}
                    <td>{exam.category}</td>

                    {/* Số câu hỏi */}
                    <td>{exam.questions}</td>

                    {/* Thời gian thi */}
                    <td>{exam.duration} phút</td>

                    {/* Trạng thái */}
                    <td>{getStatusBadge(exam.status, exam.id)}</td>

                    {/* Thao tác */}
                    <td>
                      <div className="d-flex gap-2">
                        {/* Xem */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary p-1"
                          title="Xem"
                          onClick={() => handleView(exam.id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* Chỉnh sửa */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary p-1"
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(exam.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Xóa */}
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-secondary">
                    Không có đề thi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-secondary small">
            Hiển thị {filteredExams.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + 10, filteredExams.length)} trong tổng{" "}
            {filteredExams.length} đề thi
          </div>

          <nav>
            <ul className="pagination mb-0">
              {/* Previous */}
              <li className="page-item">
                <button
                  type="button"
                  className="page-link"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>

              {/* Pages */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
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

              {/* Next */}
              <li className="page-item">
                <button
                  type="button"
                  className="page-link"
                  disabled={safePage === totalPages}
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

      {/* Create Modal */}
      <CreateExamModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateExam}
        questions={questionBank}
        examGroups={examGroups}
      />

      {/* Edit Modal */}
      <EditExamModal
        show={showEditModal}
        exam={selectedExam}
        questions={questionBank}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateExam}
        examGroups={examGroups}
      />

      {/* Delete Modal */}
      <DeleteExamModal
        show={showDeleteModal}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        exam={selectedExam}
      />

      {/* View Modal */}
      <ViewExams
        show={showViewModal}
        onClose={handleCloseView}
        exam={selectedExam}
        questions={questionBank}
      />

      {/* Confirm Modal */}
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
