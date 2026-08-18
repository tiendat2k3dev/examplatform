"use client";

import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import HeaderCategories from "../../../../components/categories/HeaderCategories";
import CreateCategoriesModal from "../../../../components/modal/categories/add/CreateCategoriesModal";
import EditCategoriesModal from "../../../../components/modal/categories/edit/EditCategoriesModal";
import DeleteCategoriesModal from "../../../../components/modal/categories/delete/DeleteCategoriesModal";

import {
  getCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  searchCategoriesService,
} from "../../../../services/categories";

import { Category } from "../../../../types/categories";

const Categories = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchText, setSearchText] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // =====================================================
  // MODAL
  // =====================================================

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================================================
  // SELECTED CATEGORY
  // =====================================================

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // =====================================================
  // LOAD CATEGORY
  // =====================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategoriesService();

      setCategories(data);

      // Load lại danh sách → về trang 1
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);

      toast.error("Không thể tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  // =====================================================
  // TÌM KIẾM
  // =====================================================

  const filteredCategories = categories.filter((category) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return category.name.toLowerCase().includes(keyword);
  });

  // =====================================================
  // PHÂN TRANG
  // =====================================================

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =====================================================
  // MỞ MODAL THÊM
  // =====================================================

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  // =====================================================
  // THÊM CATEGORY
  // =====================================================

  const handleCreate = async (names: string[]) => {
    try {
      const newCategories = await Promise.all(
        names.map((name) =>
          createCategoryService({
            name: name.trim(),
          }),
        ),
      );

      setCategories((prev) => [...prev, ...newCategories]);

      setShowCreateModal(false);

      // Về trang 1 sau khi thêm
      setCurrentPage(1);

      toast.success(`Thêm ${newCategories.length} danh mục thành công!`);
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể thêm danh mục!");
      }
    }
  };

  // =====================================================
  // MỞ MODAL SỬA
  // =====================================================

  const handleEdit = (id: string) => {
    const category = categories.find((item) => String(item.id) === String(id));

    if (!category) {
      return;
    }

    setSelectedCategory(category);

    setShowEditModal(true);
  };

  // =====================================================
  // SỬA CATEGORY
  // =====================================================

  const handleUpdate = async (name: string) => {
    if (!selectedCategory) {
      return;
    }

    try {
      const updatedCategory = await updateCategoryService(
        String(selectedCategory.id),
        {
          name: name.trim(),
        },
      );

      setCategories((prev) =>
        prev.map((category) =>
          String(category.id) === String(updatedCategory.id)
            ? updatedCategory
            : category,
        ),
      );

      setShowEditModal(false);

      setSelectedCategory(null);

      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể cập nhật danh mục!");
      }
    }
  };

  // =====================================================
  // MỞ MODAL XÓA
  // =====================================================

  const handleDelete = (id: string) => {
    const category = categories.find((item) => String(item.id) === String(id));

    if (!category) {
      return;
    }

    setSelectedCategory(category);

    setShowDeleteModal(true);
  };

  // =====================================================
  // XÓA CATEGORY
  // =====================================================

  const handleConfirmDelete = async () => {
    if (!selectedCategory) {
      return;
    }

    try {
      await deleteCategoryService(String(selectedCategory.id));

      setCategories((prev) =>
        prev.filter(
          (category) => String(category.id) !== String(selectedCategory.id),
        ),
      );

      setShowDeleteModal(false);

      setSelectedCategory(null);

      toast.success("Xóa danh mục thành công!");

      // Nếu xóa hết dữ liệu của trang hiện tại
      // thì chuyển về trang trước
      if (paginatedCategories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);

      toast.error("Không thể xóa danh mục!");
    }
  };

  // =====================================================
  // SEARCH API
  // =====================================================

  const handleSearch = async () => {
    try {
      if (!searchText.trim()) {
        await fetchCategories();
        return;
      }

      const result = await searchCategoriesService(searchText);

      setCategories(result);

      // Tìm kiếm mới → về trang 1
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm danh mục:", error);

      toast.error("Không thể tìm kiếm danh mục!");
    }
  };

  // =====================================================
  // ENTER SEARCH
  // =====================================================

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="bg-white p-4 rounded-3 shadow-sm">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <HeaderCategories
          title="Quản lý danh mục"
          description="Tạo, chỉnh sửa, xóa và quản lý danh mục"
          add="Thêm"
          onAdd={handleAdd}
        />

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text border-0 bg-light">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Tìm kiếm danh mục..."
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setCurrentPage(1);
                }}
                onKeyDown={handleSearchKeyDown}
              />

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch}
                title="Tìm kiếm"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="fw-bold text-dark">STT</th>

                <th className="fw-bold text-dark">Danh mục</th>

                <th className="fw-bold text-dark">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-secondary">
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((category, index) => (
                  <tr key={category.id} className="border-bottom">
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>

                    <td>{category.name}</td>

                    <td>
                      <div className="d-flex gap-2">
                        {/* SỬA */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary p-1"
                          title="Sửa"
                          onClick={() => handleEdit(String(category.id))}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* XÓA */}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1"
                          title="Xóa"
                          onClick={() => handleDelete(String(category.id))}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-secondary">
                    Không tìm thấy danh mục
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {!loading && filteredCategories.length > 0 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredCategories.length}
              onChange={(page) => {
                setCurrentPage(page);
              }}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL THÊM
      ===================================================== */}

      <CreateCategoriesModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      {/* =====================================================
          MODAL SỬA
      ===================================================== */}

      <EditCategoriesModal
        show={showEditModal}
        categoryName={selectedCategory?.name ?? ""}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdate}
      />

      {/* =====================================================
          MODAL XÓA
      ===================================================== */}

      <DeleteCategoriesModal
        show={showDeleteModal}
        categoryName={selectedCategory?.name ?? ""}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* =====================================================
          TOAST
      ===================================================== */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default Categories;
