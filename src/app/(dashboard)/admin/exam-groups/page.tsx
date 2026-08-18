"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import HeaderExamGroups from "../../../../components/exam-groups/HeaderExamGroupsPage";
import CreateExamGroupModal from "../../../../components/modal/exam-groups/add/exam-groupsAdd";
import EditExamGroupModal from "../../../../components/modal/exam-groups/edit/exam-groupsEdit";
import DeleteExamGroupModal from "../../../../components/modal/exam-groups/delete/exam-groupsDelete";

import {
  getExamGroupsService,
  createExamGroupService,
  updateExamGroupService,
  deleteExamGroupService,
} from "../../../../services/examGroupService";

import { ExamGroup } from "../../../../types/examGroup";

const ExamGroups = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [examGroups, setExamGroups] = useState<ExamGroup[]>([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchText, setSearchText] = useState("");

  // =====================================================
  // MODAL
  // =====================================================

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================================================
  // SELECTED EXAM GROUP
  // =====================================================

  const [selectedExamGroup, setSelectedExamGroup] = useState<ExamGroup | null>(
    null,
  );

  // =====================================================
  // LOAD EXAM GROUPS
  // =====================================================

  const fetchExamGroups = async () => {
    try {
      setLoading(true);

      const data = await getExamGroupsService();

      setExamGroups(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhóm đề thi:", error);

      toast.error("Không thể tải danh sách nhóm đề thi!");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {
    fetchExamGroups();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredExamGroups = examGroups.filter((group) => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      group.name.toLowerCase().includes(keyword) ||
      group.description.toLowerCase().includes(keyword)
    );
  });

  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = async (group: Omit<ExamGroup, "id">) => {
    try {
      const newExamGroup = await createExamGroupService(group);

      setExamGroups((prev) => [...prev, newExamGroup]);

      setShowCreateModal(false);

      toast.success("Thêm nhóm đề thi thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm nhóm đề thi:", error);

      if (error instanceof Error) {
        if (error.message.startsWith("EXAM_GROUP_NAME_EXISTS:")) {
          const name = error.message.substring("EXAM_GROUP_NAME_EXISTS:".length);
          toast.error(`Tên nhóm đề thi "${name}" đã tồn tại!`);
          return;
        }
      }

      toast.error("Không thể thêm nhóm đề thi!");
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (group: ExamGroup) => {
    setSelectedExamGroup(group);

    setShowEditModal(true);
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async (group: ExamGroup) => {
    try {
      const updatedExamGroup = await updateExamGroupService(String(group.id), {
        name: group.name.trim(),
        description: group.description.trim(),
        icon: group.icon,
        color: group.color,
      });

      setExamGroups((prev) =>
        prev.map((item) =>
          String(item.id) === String(updatedExamGroup.id)
            ? updatedExamGroup
            : item,
        ),
      );

      setShowEditModal(false);

      setSelectedExamGroup(null);

      toast.success("Cập nhật nhóm đề thi thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhóm đề thi:", error);

      if (error instanceof Error) {
        if (error.message.startsWith("EXAM_GROUP_NAME_EXISTS:")) {
          const name = error.message.substring("EXAM_GROUP_NAME_EXISTS:".length);
          toast.error(`Tên nhóm đề thi "${name}" đã tồn tại!`);
          return;
        }
      }

      toast.error("Không thể cập nhật nhóm đề thi!");
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (group: ExamGroup) => {
    setSelectedExamGroup(group);

    setShowDeleteModal(true);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const handleConfirmDelete = async () => {
    if (!selectedExamGroup) {
      return;
    }

    try {
      await deleteExamGroupService(String(selectedExamGroup.id));

      setExamGroups((prev) =>
        prev.filter(
          (group) => String(group.id) !== String(selectedExamGroup.id),
        ),
      );

      setShowDeleteModal(false);

      setSelectedExamGroup(null);

      toast.success("Xóa nhóm đề thi thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhóm đề thi:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Không thể xóa nhóm đề thi!");
      }
    }
  };

  // =====================================================
  // ICON
  // =====================================================

  const renderIcon = (group: ExamGroup) => {
    if (!group.icon) {
      return <i className="bi bi-folder-fill"></i>;
    }

    if (group.icon.startsWith("bi ")) {
      return <i className={group.icon}></i>;
    }

    if (group.icon.startsWith("bi-")) {
      return <i className={`bi ${group.icon}`}></i>;
    }

    return (
      <span
        style={{
          fontSize: "20px",
          fontWeight: 700,
        }}
      >
        {group.icon}
      </span>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f8f9fa",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex-shrink-0">
        <HeaderExamGroups
          title="Quản lý nhóm đề thi"
          description="Quản lý các nhóm đề thi trong hệ thống"
          add="Thêm nhóm mới"
          onAdd={handleAdd}
        />
      </div>

      {/* =====================================================
          SCROLLABLE CONTENT
      ===================================================== */}

      <div
        className="flex-grow-1 overflow-auto px-4 pb-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#adb5bd transparent",
        }}
      >
        {/* SEARCH */}

        <div className="bg-white p-3 rounded-3 shadow-sm mb-4">
          <div
            className="input-group"
            style={{
              maxWidth: "780px",
            }}
          >
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm nhóm đề thi..."
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="bg-white rounded-3 shadow-sm">
            <div className="text-center py-5 text-secondary">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></div>
              Đang tải nhóm đề thi...
            </div>
          </div>
        ) : filteredExamGroups.length === 0 ? (
          /* =====================================================
              EMPTY
          ===================================================== */

          <div className="bg-white rounded-3 shadow-sm">
            <div className="text-center py-5 text-secondary">
              <i
                className="bi bi-folder-x"
                style={{
                  fontSize: "40px",
                }}
              ></i>

              <p className="mt-3 mb-0">Không tìm thấy nhóm đề thi</p>
            </div>
          </div>
        ) : (
          /* =====================================================
             LIST CARD
          ===================================================== */

          <div className="row g-4">
            {filteredExamGroups.map((group) => (
              <div className="col-12 col-md-6 col-lg-4" key={group.id}>
                <div
                  className="card h-100 shadow-sm"
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                  }}
                >
                  {/* ================= CARD BODY ================= */}

                  <div className="card-body">
                    {/* ICON */}

                    <div
                      className="mb-4"
                      style={{
                        color: group.color || "#212529",
                        fontSize: "22px",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {renderIcon(group)}
                    </div>

                    {/* NAME */}

                    <h5
                      className="card-title mb-2 fw-semibold"
                      style={{
                        color: "#111827",
                      }}
                    >
                      {group.name}
                    </h5>

                    {/* DESCRIPTION */}

                    <p
                      className="card-text mb-0"
                      style={{
                        color: "#718096",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      {group.description}
                    </p>
                  </div>

                  {/* ================= CARD FOOTER ================= */}

                  <div
                    className="card-footer d-flex justify-content-end align-items-center"
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderTop: "1px solid #dee2e6",
                    }}
                  >
                    {/* EDIT */}

                    <button
                      type="button"
                      className="btn btn-sm p-1 text-primary me-3"
                      title="Sửa"
                      onClick={() => handleEdit(group)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="btn btn-sm p-1 text-danger"
                      title="Xóa"
                      onClick={() => handleDelete(group)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      <CreateExamGroupModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {selectedExamGroup && (
        <EditExamGroupModal
          show={showEditModal}
          group={selectedExamGroup}
          onClose={() => {
            setShowEditModal(false);
            setSelectedExamGroup(null);
          }}
          onUpdate={handleUpdate}
        />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {selectedExamGroup && (
        <DeleteExamGroupModal
          show={showDeleteModal}
          group={selectedExamGroup}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedExamGroup(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

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

export default ExamGroups;
