"use client";

// useState dùng để quản lý state trong component
import { useState } from "react";

// Import các component con
import HeaderQuestions from "../../../../components/questions/HeaderQuestions";
import CreateQuestionModal from "../../../../components/modal/questions/add/CreateQuestionModal";
import EditQuestionModal from "../../../../components/modal/questions/edit/EditQuestionModal";
import DeleteQuestionModal from "../../../../components/modal/questions/delete/DeleteQuestionModal";
import ViewQuestionModal from "../../../../components/modal/questions/view/ViewQuestionModal";

// ======================================================
// KIỂU DỮ LIỆU CHO ĐÁP ÁN
// ======================================================

interface AnswerOption {
  // key chỉ được phép là A, B, C hoặc D
  key: "A" | "B" | "C" | "D";

  // Nội dung của đáp án
  value: string;
}

// ======================================================
// KIỂU DỮ LIỆU CHO CÂU HỎI
// ======================================================

export interface Question {
  // ID của câu hỏi
  id: number;

  // Nội dung câu hỏi
  question: string;

  // Danh mục của câu hỏi
  category: string;

  // Danh sách đáp án
  // ? nghĩa là thuộc tính này có thể không có
  answers?: AnswerOption[];

  // Đáp án đúng
  // Chỉ có thể là A, B, C hoặc D
  correctAnswer?: "A" | "B" | "C" | "D";
}

// ======================================================
// TÊN CÁC CỘT CỦA TABLE
// ======================================================

const table: string[] = ["STT", "CÂU HỎI", "DANH MỤC", "THAO TÁC"];

// ======================================================
// DỮ LIỆU CÂU HỎI BAN ĐẦU
// Đây chỉ là dữ liệu mẫu, sau này có thể lấy từ API
// ======================================================

const initialQuestions: Question[] = [
  {
    id: 1,

    // Nội dung câu hỏi
    question: "1+1= ?",

    // Danh mục
    category: "Toán",

    // Các đáp án
    answers: [
      { key: "A", value: "2" },
      { key: "B", value: "3" },
      { key: "C", value: "4" },
      { key: "D", value: "5" },
    ],

    // Đáp án đúng
    correctAnswer: "A",
  },

  {
    id: 2,
    question: "What is the capital of France?",
    category: "Geography",

    answers: [
      { key: "A", value: "Berlin" },
      { key: "B", value: "Paris" },
      { key: "C", value: "Rome" },
      { key: "D", value: "Madrid" },
    ],

    correctAnswer: "B",
  },

  {
    id: 3,
    question: "Who wrote Hamlet?",
    category: "Literature",

    answers: [
      { key: "A", value: "Shakespeare" },
      { key: "B", value: "Tolstoy" },
      { key: "C", value: "Dostoevsky" },
      { key: "D", value: "Hemingway" },
    ],

    correctAnswer: "A",
  },

  {
    id: 4,
    question: "What is the chemical symbol for Gold?",
    category: "Science",

    answers: [
      { key: "A", value: "Go" },
      { key: "B", value: "Gd" },
      { key: "C", value: "Au" },
      { key: "D", value: "Ag" },
    ],

    correctAnswer: "C",
  },

  {
    id: 5,
    question: "When did WWII end?",
    category: "History",

    answers: [
      { key: "A", value: "1943" },
      { key: "B", value: "1945" },
      { key: "C", value: "1947" },
      { key: "D", value: "1939" },
    ],

    correctAnswer: "B",
  },
];

// ======================================================
// COMPONENT QUESTIONS
// ======================================================

const Questions = () => {
  // ====================================================
  // STATE DANH SÁCH CÂU HỎI
  // ====================================================

  // questions: danh sách câu hỏi hiện tại
  // setQuestions: hàm dùng để cập nhật danh sách câu hỏi
  //
  // Ban đầu lấy dữ liệu từ initialQuestions
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  // ====================================================
  // STATE HIỂN THỊ MODAL THÊM
  // ====================================================

  // false = modal đang đóng
  // true = modal đang mở
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ====================================================
  // STATE HIỂN THỊ MODAL SỬA
  // ====================================================

  const [showEditModal, setShowEditModal] = useState(false);

  // ====================================================
  // STATE HIỂN THỊ MODAL XÓA
  // ====================================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ====================================================
  // STATE HIỂN THỊ MODAL XEM
  // ====================================================

  const [showViewModal, setShowViewModal] = useState(false);

  // ====================================================
  // CÂU HỎI ĐANG ĐƯỢC CHỌN
  // ====================================================

  // null = chưa chọn câu hỏi nào
  //
  // Ví dụ click sửa câu số 2:
  // selectedQuestion = câu hỏi có id = 2
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  // ====================================================
  // STATE TÌM KIẾM
  // ====================================================

  // Lưu nội dung người dùng nhập vào ô tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");

  // ====================================================
  // LỌC DANH SÁCH CÂU HỎI
  // ====================================================

  // filter() dùng để lấy ra những câu hỏi phù hợp
  // với từ khóa tìm kiếm
  const filteredQuestions = questions.filter((item) => {
    // trim() bỏ khoảng trắng đầu/cuối
    // toLowerCase() chuyển thành chữ thường
    const keyword = searchKeyword.trim().toLowerCase();

    // Nếu không nhập từ khóa
    // thì hiển thị tất cả câu hỏi
    if (!keyword) {
      return true;
    }

    // Tìm kiếm theo:
    // 1. Nội dung câu hỏi
    // 2. Danh mục
    return (
      item.question.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    );
  });

  // ====================================================
  // THÊM CÂU HỎI
  // ====================================================

  const handleCreateQuestion = (newQuestion: {
    question: string;
    category: string;
    answers: AnswerOption[];
    correctAnswer: "A" | "B" | "C" | "D";
  }) => {
    // Cập nhật danh sách câu hỏi
    setQuestions((prev) => {
      // Tạo ID mới
      //
      // Ví dụ:
      // Danh sách hiện tại có ID: 1, 2, 3, 4, 5
      // nextId sẽ bằng 6
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1;

      // Giữ lại tất cả câu hỏi cũ
      // sau đó thêm câu hỏi mới vào cuối
      return [
        ...prev,

        {
          id: nextId,

          question: newQuestion.question,

          category: newQuestion.category,

          answers: newQuestion.answers,

          correctAnswer: newQuestion.correctAnswer,
        },
      ];
    });

    // Thêm thành công thì đóng modal
    setShowCreateModal(false);
  };

  // ====================================================
  // MỞ MODAL SỬA
  // ====================================================

  const handleOpenEdit = (question: Question) => {
    // Lưu câu hỏi đang muốn sửa
    setSelectedQuestion(question);

    // Mở modal sửa
    setShowEditModal(true);
  };

  // ====================================================
  // SỬA CÂU HỎI
  // ====================================================

  const handleEditQuestion = (updatedQuestion: Question) => {
    // map() duyệt qua toàn bộ danh sách
    setQuestions((prev) =>
      prev.map((item) =>
        // Nếu ID giống câu hỏi đang sửa
        // thì thay bằng dữ liệu mới
        item.id === updatedQuestion.id
          ? updatedQuestion
          : // Nếu không giống thì giữ nguyên
            item,
      ),
    );

    // Đóng modal sửa
    setShowEditModal(false);

    // Xóa câu hỏi đang được chọn
    setSelectedQuestion(null);
  };

  // ====================================================
  // XÓA CÂU HỎI
  // ====================================================

  const handleDeleteQuestion = () => {
    // Nếu chưa chọn câu hỏi
    // thì không thực hiện xóa
    if (!selectedQuestion) {
      return;
    }

    // filter() tạo ra danh sách mới
    // không chứa câu hỏi đang được chọn
    setQuestions((prev) =>
      prev.filter((item) => item.id !== selectedQuestion.id),
    );

    // Đóng modal xóa
    setShowDeleteModal(false);

    // Xóa câu hỏi đang chọn
    setSelectedQuestion(null);
  };

  // ====================================================
  // MỞ MODAL XÓA
  // ====================================================

  const handleOpenDelete = (question: Question) => {
    // Lưu câu hỏi muốn xóa
    setSelectedQuestion(question);

    // Mở modal xác nhận xóa
    setShowDeleteModal(true);
  };

  // ====================================================
  // MỞ MODAL XEM
  // ====================================================

  const handleOpenView = (question: Question) => {
    // Lưu câu hỏi muốn xem
    setSelectedQuestion(question);

    // Mở modal xem
    setShowViewModal(true);
  };

  // ====================================================
  // ĐÓNG MODAL SỬA
  // ====================================================

  const handleCloseEdit = () => {
    // Đóng modal sửa
    setShowEditModal(false);

    // Xóa câu hỏi đang chọn
    setSelectedQuestion(null);
  };

  // ====================================================
  // ĐÓNG MODAL XÓA
  // ====================================================

  const handleCloseDelete = () => {
    // Đóng modal xóa
    setShowDeleteModal(false);

    // Xóa câu hỏi đang chọn
    setSelectedQuestion(null);
  };

  // ====================================================
  // ĐÓNG MODAL XEM
  // ====================================================

  const handleCloseView = () => {
    // Đóng modal xem
    setShowViewModal(false);

    // Xóa câu hỏi đang chọn
    setSelectedQuestion(null);
  };

  // ====================================================
  // GIAO DIỆN
  // ====================================================

  return (
    <div className="container-fluid p-3">
      {/* ==================================================
          HEADER
      ================================================== */}

      <HeaderQuestions
        title="Quản lý câu hỏi"
        description="Tạo, chỉnh sửa, xóa và quản lý câu hỏi"
        add="Thêm"
        // Click nút Thêm
        // => mở CreateQuestionModal
        onAdd={() => setShowCreateModal(true)}
      />

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              {/* Label của ô tìm kiếm */}
              <label
                htmlFor="searchQuestion"
                className="form-label fw-semibold"
              >
                Tìm kiếm
              </label>

              <div className="input-group">
                {/* Icon tìm kiếm */}
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>

                {/* Ô nhập tìm kiếm */}
                <input
                  id="searchQuestion"
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm câu hỏi hoặc danh mục..."
                  // Giá trị của input lấy từ state
                  value={searchKeyword}
                  // Mỗi khi người dùng nhập
                  // cập nhật searchKeyword
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />

                {/* Chỉ hiển thị nút X
                    khi đang có từ khóa */}
                {searchKeyword && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    // Xóa từ khóa tìm kiếm
                    onClick={() => setSearchKeyword("")}
                    title="Xóa tìm kiếm"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            {/* ================================
                TABLE HEADER
            ================================= */}

            <thead className="table-primary">
              <tr>
                {/* Duyệt qua mảng table
                    để tạo các cột */}
                {table.map((item, index) => (
                  <th
                    key={index}
                    // Cột đầu tiên có padding trái/phải
                    className={index === 0 ? "px-3" : ""}
                    style={{
                      // Cột STT rộng 70px
                      width:
                        index === 0
                          ? "70px"
                          : // Cột danh mục rộng 180px
                            index === 2
                            ? "180px"
                            : // Cột thao tác rộng 150px
                              index === 3
                              ? "150px"
                              : undefined,
                    }}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ================================
                TABLE BODY
            ================================= */}

            <tbody>
              {/* Nếu không tìm thấy câu hỏi */}
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-secondary">
                    {/* Icon tìm kiếm */}
                    <i className="bi bi-search fs-3 d-block mb-2"></i>
                    Không tìm thấy câu hỏi
                  </td>
                </tr>
              ) : (
                // Nếu có dữ liệu
                // duyệt qua danh sách câu hỏi
                filteredQuestions.map((item) => (
                  <tr key={item.id}>
                    {/* =========================
                        STT
                    ========================== */}

                    <td className="px-3">{item.id}</td>

                    {/* =========================
                        CÂU HỎI
                    ========================== */}

                    <td>{item.question}</td>

                    {/* =========================
                        DANH MỤC
                        Không dùng badge
                        => chỉ hiển thị chữ đen
                    ========================== */}

                    <td className="text-dark">{item.category}</td>

                    {/* =========================
                        THAO TÁC
                    ========================== */}

                    <td>
                      <div className="d-flex gap-3">
                        {/* ======================
                            XEM
                        ======================= */}

                        <button
                          type="button"
                          className="btn btn-link text-primary p-0"
                          title="Xem"
                          // Mở modal xem
                          onClick={() => handleOpenView(item)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* ======================
                            SỬA
                        ======================= */}

                        <button
                          type="button"
                          className="btn btn-link text-warning p-0"
                          title="Sửa"
                          // Mở modal sửa
                          onClick={() => handleOpenEdit(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* ======================
                            XÓA
                        ======================= */}

                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          title="Xóa"
                          // Mở modal xác nhận xóa
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
            FOOTER + PAGINATION
        ================================================== */}

        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          {/* Hiển thị số lượng câu hỏi */}
          <span className="text-secondary small">
            Showing 1 to {filteredQuestions.length} of{" "}
            {filteredQuestions.length} entries
          </span>

          {/* Pagination */}
          <nav>
            <ul className="pagination pagination-sm mb-0">
              {/* Previous */}
              <li className="page-item disabled">
                <button type="button" className="page-link">
                  Previous
                </button>
              </li>

              {/* Trang 1 */}
              <li className="page-item active">
                <button type="button" className="page-link">
                  1
                </button>
              </li>

              {/* Trang 2 */}
              <li className="page-item">
                <button type="button" className="page-link">
                  2
                </button>
              </li>

              {/* Trang 3 */}
              <li className="page-item">
                <button type="button" className="page-link">
                  3
                </button>
              </li>

              {/* Dấu ... */}
              <li className="page-item">
                <button type="button" className="page-link">
                  ...
                </button>
              </li>

              {/* Trang 10 */}
              <li className="page-item">
                <button type="button" className="page-link">
                  10
                </button>
              </li>

              {/* Next */}
              <li className="page-item">
                <button type="button" className="page-link">
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ==================================================
          CREATE QUESTION MODAL
      ================================================== */}

      <CreateQuestionModal
        // true => hiển thị modal
        show={showCreateModal}
        // Đóng modal
        onClose={() => setShowCreateModal(false)}
        // Xử lý khi submit câu hỏi mới
        onSubmit={handleCreateQuestion}
      />

      {/* ==================================================
          EDIT QUESTION MODAL
      ================================================== */}

      <EditQuestionModal
        // true => hiển thị modal sửa
        show={showEditModal}
        // Đóng modal
        onClose={handleCloseEdit}
        // Xử lý khi sửa
        onSubmit={handleEditQuestion}
        // Truyền câu hỏi đang chọn vào modal
        questionToEdit={selectedQuestion}
      />

      {/* ==================================================
          DELETE QUESTION MODAL
      ================================================== */}

      <DeleteQuestionModal
        // true => hiển thị modal xóa
        show={showDeleteModal}
        // Đóng modal
        onClose={handleCloseDelete}
        // Xác nhận xóa
        onConfirm={handleDeleteQuestion}
        // Câu hỏi cần xóa
        question={selectedQuestion}
      />

      {/* ==================================================
          VIEW QUESTION MODAL
      ================================================== */}

      <ViewQuestionModal
        // true => hiển thị modal xem
        show={showViewModal}
        // Đóng modal
        onClose={handleCloseView}
        // Câu hỏi cần xem
        question={selectedQuestion}
      />
    </div>
  );
};

// Export component để sử dụng ở page
export default Questions;
