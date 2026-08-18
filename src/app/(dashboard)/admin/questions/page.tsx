"use client";

import { useEffect, useState } from "react";
import { Pagination } from "antd";

import {
  getQuestionsService,
  getQuestionDetailService,
  createQuestionService,
  updateQuestionService,
  deleteQuestionService,
} from "../../../../services/questionService";

import { getCategoriesService } from "../../../../services/categories";

import HeaderQuestions from "../../../../components/questions/HeaderQuestions";

import CreateQuestionModal from "../../../../components/modal/questions/add/CreateQuestionModal";
import EditQuestionModal from "../../../../components/modal/questions/edit/EditQuestionModal";
import DeleteQuestionModal from "../../../../components/modal/questions/delete/DeleteQuestionModal";
import ViewQuestionModal from "../../../../components/modal/questions/view/ViewQuestionModal";

import {
  Question,
  CreateQuestionData,
  UpdateQuestionData,
} from "@/types/question";

import { Category } from "../../../../types/categories";

import { toast } from "react-toastify";

// ======================================================
// TÊN CÁC CỘT TABLE
// ======================================================

const table: string[] = ["STT", "CÂU HỎI", "DANH MỤC", "THAO TÁC"];

// ======================================================
// COMPONENT QUESTIONS
// ======================================================

const Questions = () => {
  // ====================================================
  // STATE DANH SÁCH CÂU HỎI
  // ====================================================

  const [questions, setQuestions] = useState<Question[]>([]);

  // ====================================================
  // STATE DANH SÁCH DANH MỤC
  // ====================================================

  const [categories, setCategories] = useState<Category[]>([]);

  // ====================================================
  // STATE LOADING DANH SÁCH
  // ====================================================

  const [loading, setLoading] = useState<boolean>(true);

  // ====================================================
  // STATE LOADING THAO TÁC
  // ====================================================

  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // ====================================================
  // STATE MODAL THÊM
  // ====================================================

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // ====================================================
  // STATE MODAL SỬA
  // ====================================================

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // ====================================================
  // STATE MODAL XÓA
  // ====================================================

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // ====================================================
  // STATE MODAL XEM
  // ====================================================

  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  // ====================================================
  // CÂU HỎI ĐANG ĐƯỢC CHỌN
  // ====================================================

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  // ====================================================
  // STATE TÌM KIẾM
  // ====================================================

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // ====================================================
  // STATE PHÂN TRANG
  // ====================================================

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pageSize, setPageSize] = useState<number>(10);

  // ====================================================
  // LẤY DANH SÁCH QUESTIONS + CATEGORIES
  // ====================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [questionsData, categoriesData] = await Promise.all([
        getQuestionsService(),
        getCategoriesService(),
      ]);

      console.log("Danh sách câu hỏi:", questionsData);

      console.log("Danh sách danh mục:", categoriesData);

      setQuestions(questionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);

      toast.error("Không thể tải danh sách câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // USE EFFECT
  // ====================================================

  useEffect(() => {
    fetchData();
  }, []);

  // ====================================================
  // LẤY TÊN DANH MỤC THEO CATEGORY ID
  // ====================================================

  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) {
      return "Không xác định";
    }

    const category = categories.find((item) => item.id === categoryId);

    return category?.name || "Không xác định";
  };

  // ====================================================
  // TÌM KIẾM
  // ====================================================

  const filteredQuestions = questions.filter((item) => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    const questionContent = item.content?.toLowerCase() || "";

    const categoryName = getCategoryName(item.categoryId).toLowerCase();

    return questionContent.includes(keyword) || categoryName.includes(keyword);
  });

  // ====================================================
  // DỮ LIỆU THEO TRANG
  // ====================================================

  const startIndex = (currentPage - 1) * pageSize;

  const endIndex = startIndex + pageSize;

  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // ====================================================
  // THÊM CÂU HỎI
  // ====================================================

  const handleCreateQuestion = async (data: CreateQuestionData) => {
    try {
      setActionLoading(true);

      console.log("Dữ liệu tạo câu hỏi:", data);

      // ================================================
      // GỌI API CREATE
      // ================================================

      const newQuestion = await createQuestionService(data);

      console.log("Câu hỏi sau khi tạo:", newQuestion);

      // ================================================
      // CẬP NHẬT DANH SÁCH
      // ================================================

      setQuestions((prev) => [...prev, newQuestion]);

      // ================================================
      // ĐÓNG MODAL
      // ================================================

      setShowCreateModal(false);

      // ================================================
      // CHUYỂN VỀ TRANG CUỐI
      // ================================================

      const newTotal = questions.length + 1;

      const newLastPage = Math.max(1, Math.ceil(newTotal / pageSize));

      setCurrentPage(newLastPage);

      toast.success("Thêm câu hỏi thành công");
    } catch (error) {
      console.error("Lỗi khi thêm câu hỏi:", error);

      toast.error("Thêm câu hỏi thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // MỞ MODAL SỬA
  // ====================================================

  const handleOpenEdit = async (question: Question) => {
    if (!question.id) {
      toast.error("Không tìm thấy ID câu hỏi");
      return;
    }

    try {
      setActionLoading(true);

      const detail = await getQuestionDetailService(question.id);

      console.log("Chi tiết câu hỏi:", detail);

      setSelectedQuestion(detail);
      setShowEditModal(true);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết câu hỏi:", error);

      // Nếu API detail lỗi thì vẫn mở
      // dữ liệu hiện tại

      setSelectedQuestion(question);
      setShowEditModal(true);

      toast.error("Không thể tải chi tiết câu hỏi");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // SỬA CÂU HỎI
  // ====================================================

  const handleEditQuestion = async (id: string, data: UpdateQuestionData) => {
    try {
      setActionLoading(true);

      console.log("ID câu hỏi sửa:", id);

      console.log("Dữ liệu sửa:", data);

      // ================================================
      // GỌI API UPDATE
      // ================================================

      const updatedQuestion = await updateQuestionService(id, data);

      console.log("Câu hỏi sau khi sửa:", updatedQuestion);

      // ================================================
      // CẬP NHẬT STATE
      // ================================================

      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updatedQuestion,
              }
            : item,
        ),
      );

      // ================================================
      // ĐÓNG MODAL
      // ================================================

      setShowEditModal(false);
      setSelectedQuestion(null);

      toast.success("Cập nhật câu hỏi thành công");
    } catch (error) {
      console.error("Lỗi khi sửa câu hỏi:", error);

      toast.error("Cập nhật câu hỏi thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // MỞ MODAL XÓA
  // ====================================================

  const handleOpenDelete = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  // ====================================================
  // XÓA CÂU HỎI
  // ====================================================

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion?.id) {
      toast.error("Không tìm thấy ID câu hỏi");
      return;
    }

    try {
      setActionLoading(true);

      const questionId = selectedQuestion.id;

      console.log("ID câu hỏi cần xóa:", questionId);

      // ================================================
      // GỌI API DELETE
      // ================================================

      await deleteQuestionService(questionId);

      // ================================================
      // XÓA KHỎI STATE
      // ================================================

      setQuestions((prev) => prev.filter((item) => item.id !== questionId));

      // ================================================
      // ĐÓNG MODAL
      // ================================================

      setShowDeleteModal(false);
      setSelectedQuestion(null);

      // ================================================
      // TÍNH LẠI TRANG
      // ================================================

      const remaining = questions.length - 1;

      const maxPage = Math.max(1, Math.ceil(remaining / pageSize));

      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }

      toast.success("Xóa câu hỏi thành công");
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);

      toast.error("Xóa câu hỏi thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // MỞ MODAL XEM
  // ====================================================

  const handleOpenView = async (question: Question) => {
    if (!question.id) {
      toast.error("Không tìm thấy ID câu hỏi");
      return;
    }

    try {
      setActionLoading(true);

      const detail = await getQuestionDetailService(question.id);

      setSelectedQuestion(detail);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết câu hỏi:", error);

      setSelectedQuestion(question);

      toast.error("Không thể tải chi tiết câu hỏi");
    } finally {
      setActionLoading(false);
    }

    setShowViewModal(true);
  };

  // ====================================================
  // ĐÓNG MODAL SỬA
  // ====================================================

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedQuestion(null);
  };

  // ====================================================
  // ĐÓNG MODAL XÓA
  // ====================================================

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedQuestion(null);
  };

  // ====================================================
  // ĐÓNG MODAL XEM
  // ====================================================

  const handleCloseView = () => {
    setShowViewModal(false);
    setSelectedQuestion(null);
  };

  // ====================================================
  // TÌM KIẾM
  // ====================================================

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  // ====================================================
  // XÓA TỪ KHÓA
  // ====================================================

  const handleClearSearch = () => {
    setSearchKeyword("");
    setCurrentPage(1);
  };

  // ====================================================
  // PAGINATION CHANGE
  // ====================================================

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // ====================================================
  // GIAO DIỆN
  // ====================================================

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div className="bg-white p-4 rounded-3 shadow-sm">
        {/* ==================================================
            HEADER
        ================================================== */}

        <HeaderQuestions
          title="Quản lý câu hỏi"
          description="Tạo, chỉnh sửa, xóa và quản lý câu hỏi"
          add="Thêm"
          onAdd={() => setShowCreateModal(true)}
        />

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="row mb-4 g-3">
          <div className="col-md-12">
            <div className="input-group">
              <span className="input-group-text border-0 bg-light">
                <i className="bi bi-search"></i>
              </span>

              <input
                id="searchQuestion"
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Tìm kiếm câu hỏi hoặc danh mục..."
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {searchKeyword && (
                <button
                  type="button"
                  className="btn btn-outline-secondary border-0 bg-light"
                  onClick={handleClearSearch}
                  title="Xóa tìm kiếm"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            {/* HEADER */}

            <thead className="table-light">
              <tr>
                {table.map((item, index) => (
                  <th
                    key={index}
                    className="fw-bold text-dark"
                    style={{
                      width:
                        index === 0
                          ? "70px"
                          : index === 2
                            ? "180px"
                            : index === 3
                              ? "150px"
                              : undefined,
                    }}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>

                    <div className="mt-2 text-secondary">
                      Đang tải danh sách câu hỏi...
                    </div>
                  </td>
                </tr>
              ) : paginatedQuestions.length === 0 ? (
                /* EMPTY */

                <tr>
                  <td colSpan={4} className="text-center py-5 text-secondary">
                    <i className="bi bi-search fs-3 d-block mb-2"></i>

                    {searchKeyword
                      ? "Không tìm thấy câu hỏi phù hợp"
                      : "Chưa có câu hỏi"}
                  </td>
                </tr>
              ) : (
                /* DATA */

                paginatedQuestions.map((item, index) => (
                  <tr key={item.id}>
                    {/* STT */}

                    <td className="px-3">{startIndex + index + 1}</td>

                    {/* CÂU HỎI */}

                    <td>{item.content}</td>

                    {/* DANH MỤC */}

                    <td className="text-dark">
                      {getCategoryName(item.categoryId)}
                    </td>

                    {/* THAO TÁC */}

                    <td>
                      <div className="d-flex gap-2">
                        {/* VIEW */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary p-1"
                          title="Xem"
                          disabled={actionLoading}
                          onClick={() => handleOpenView(item)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary p-1"
                          title="Sửa"
                          disabled={actionLoading}
                          onClick={() => handleOpenEdit(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1"
                          title="Xóa"
                          disabled={actionLoading}
                          onClick={() => handleOpenDelete(item)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {!loading && filteredQuestions.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-secondary small">
              {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)}{" "}
              trong tổng {filteredQuestions.length} câu hỏi
              {searchKeyword && ` (lọc từ ${questions.length} câu hỏi)`}
            </span>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredQuestions.length}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
              showQuickJumper
              onChange={handlePaginationChange}
              showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
            />
          </div>
        )}

        {/* ==================================================
            CREATE MODAL
        ================================================== */}

        <CreateQuestionModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          categories={categories}
          onSubmit={handleCreateQuestion}
        />

        {/* ==================================================
            EDIT MODAL
        ================================================== */}

        <EditQuestionModal
          show={showEditModal}
          onClose={handleCloseEdit}
          onSubmit={handleEditQuestion}
          questionToEdit={selectedQuestion}
          categories={categories}
        />

        {/* ==================================================
            DELETE MODAL
        ================================================== */}

        <DeleteQuestionModal
          show={showDeleteModal}
          onClose={handleCloseDelete}
          onConfirm={handleDeleteQuestion}
          question={selectedQuestion}
        />

        {/* ==================================================
            VIEW MODAL
        ================================================== */}

        <ViewQuestionModal
          show={showViewModal}
          onClose={handleCloseView}
          question={selectedQuestion}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Questions;
