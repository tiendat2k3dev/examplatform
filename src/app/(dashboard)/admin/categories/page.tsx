"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import HeaderCategories from "../../../../components/categories/HeaderCategories";
import CreateCategoriesModal from "../../../../components/modal/categories/add/CreateCategoriesModal";
import EditCategoriesModal from "../../../../components/modal/categories/edit/EditCategoriesModal";
import DeleteCategoriesModal from "../../../../components/modal/categories/delete/DeleteCategoriesModal";

interface Category {
  id: number;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Toán học",
    },
    {
      id: 2,
      name: "Vật lý",
    },
  ]);

  // Tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Modal thêm
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modal sửa
  const [showEditModal, setShowEditModal] = useState(false);

  // Modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Category đang được sửa / xóa
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // =========================
  // LỌC CATEGORY
  // =========================
  const filteredCategories = categories.filter((category) => {
    const keyword = searchText.trim().toLowerCase();

    return !keyword || category.name.toLowerCase().includes(keyword);
  });

  // =========================
  // MỞ MODAL THÊM
  // =========================
  const handleAdd = () => {
    setShowCreateModal(true);
  };

  // =========================
  // THÊM CATEGORY
  // =========================
  const handleCreate = (name: string) => {
    const newCategory: Category = {
      id: Date.now(),
      name,
    };

    setCategories((prev) => [...prev, newCategory]);

    setShowCreateModal(false);

    toast.success("Thêm danh mục thành công!");
  };

  // =========================
  // MỞ MODAL SỬA
  // =========================
  const handleEdit = (id: number) => {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    setSelectedCategory(category);
    setShowEditModal(true);
  };

  // =========================
  // SỬA CATEGORY
  // =========================
  const handleUpdate = (name: string) => {
    if (!selectedCategory) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              name,
            }
          : category,
      ),
    );

    setShowEditModal(false);
    setSelectedCategory(null);

    toast.success("Cập nhật danh mục thành công!");
  };

  // =========================
  // MỞ MODAL XÓA
  // =========================
  const handleDelete = (id: number) => {
    const category = categories.find((item) => item.id === id);

    if (!category) return;

    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // =========================
  // XÓA CATEGORY
  // =========================
  const handleConfirmDelete = () => {
    if (!selectedCategory) return;

    setCategories((prev) =>
      prev.filter((category) => category.id !== selectedCategory.id),
    );

    setShowDeleteModal(false);
    setSelectedCategory(null);

    toast.success("Xóa danh mục thành công!");
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="bg-white p-4 rounded-3 shadow-sm">
        <HeaderCategories
          title="Quản lý danh mục"
          description="Tạo, chỉnh sửa, xóa và quản lý danh mục"
          add="Thêm"
          onAdd={handleAdd}
        />

        {/* =========================
            TÌM KIẾM
        ========================= */}
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
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* =========================
            TABLE
        ========================= */}
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr key={category.id} className="border-bottom">
                    <td>{index + 1}</td>

                    <td>{category.name}</td>

                    <td>
                      <div className="d-flex gap-2">
                        {/* Sửa */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary p-1"
                          title="Sửa"
                          onClick={() => handleEdit(category.id)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        {/* Xóa */}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1"
                          title="Xóa"
                          onClick={() => handleDelete(category.id)}
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
      </div>

      {/* =========================
          MODAL THÊM
      ========================= */}
      <CreateCategoriesModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      {/* =========================
          MODAL SỬA
      ========================= */}
      <EditCategoriesModal
        show={showEditModal}
        categoryName={selectedCategory?.name ?? ""}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdate}
      />

      {/* =========================
          MODAL XÓA
      ========================= */}
      <DeleteCategoriesModal
        show={showDeleteModal}
        categoryName={selectedCategory?.name ?? ""}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast */}
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
