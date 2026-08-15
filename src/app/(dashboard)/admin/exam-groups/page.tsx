"use client";

import { useState } from "react";
import HeaderExamGroupsPage from "../../../../components/exam-groups/HeaderExamGroupsPage";
import Add from "../../../../components/modal/exam-groups/add/exam-groupsAdd";
import Edit from "../../../../components/modal/exam-groups/edit/exam-groupsEdit";
import Delete from "@/components/modal/exam-groups/delete/exam-groupsDelete";
import { toast } from "react-toastify";
import type { ExamGroup } from "@/components/modal/exam-groups/add/exam-groupsAdd";
const ExamGroupsPage = () => {
  const [examGroups, setExamGroups] = useState<ExamGroup[]>([
    {
      id: 1,
      name: "Java Backend",
      description:
        "Java Core, OOP, Spring Boot, Collection Framework & Multithreading.",
      icon: "☕",
      iconClass: "bg-danger-subtle text-danger",
    },
    {
      id: 2,
      name: "C# & .NET",
      description:
        "C# Basic, .NET Core Web API, Entity Framework, LINQ & MVC Architecture.",
      icon: "▦",
      iconClass: "bg-primary-subtle text-primary",
    },
    {
      id: 3,
      name: "Frontend Web",
      description:
        "HTML5, CSS3, JavaScript ES6+, Bootstrap 5 & ReactJS căn bản.",
      icon: "HTML",
      iconClass: "bg-warning-subtle text-warning",
    },
    {
      id: 4,
      name: "Cơ Sở Dữ Liệu",
      description:
        "SQL Server, MySQL, các câu lệnh truy vấn Join, Group By, Subquery & Index.",
      icon: "●",
      iconClass: "bg-success-subtle text-success",
    },
    {
      id: 5,
      name: "C / C++ Base",
      description:
        "Cấu trúc dữ liệu & Giải thuật, Con trỏ, Mảng, Struct & Quản lý bộ nhớ.",
      icon: "⚙",
      iconClass: "bg-info-subtle text-info",
    },
    {
      id: 6,
      name: "Python Lập Trình",
      description:
        "Cú pháp cơ bản, String/List/Dict, Function, Module & xử lý File trong Python.",
      icon: "<>",
      iconClass: "bg-secondary-subtle text-secondary",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ExamGroup | null>(null);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleCreate = (group: ExamGroup) => {
    setExamGroups((prev) => [group, ...prev]);
  };

  const handleEdit = (group: ExamGroup) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleUpdate = (updated: ExamGroup) => {
    setExamGroups((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
  };

  const handleDelete = (group: ExamGroup) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedGroup) {
      return;
    }

    setExamGroups((prev) =>
      prev.filter((item) => item.id !== selectedGroup.id),
    );

    toast.success("Xóa nhóm đề thi thành công!");
    setShowDeleteModal(false);
    setSelectedGroup(null);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-4 py-4">
      <HeaderExamGroupsPage
        title="Quản lý nhóm đề thi"
        description="Quản lý các nhóm đề thi trong hệ thống"
        add="Thêm nhóm mới"
        onAdd={handleAdd}
      />

      <div className="row g-4">
        {examGroups.map((group) => (
          <div key={group.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 border shadow-sm">
              <div className="card-body p-3">
                <div
                  className={`d-flex align-items-center justify-content-center rounded mb-3 ${group.iconClass}`}
                  style={{
                    width: "42px",
                    height: "42px",
                    fontSize: group.icon === "HTML" ? "9px" : "20px",
                    fontWeight: "700",
                  }}
                >
                  {group.icon}
                </div>

                <h5 className="card-title fw-semibold text-dark mb-2">
                  {group.name}
                </h5>

                <p
                  className="card-text text-secondary small mb-0"
                  style={{
                    minHeight: "48px",
                    lineHeight: "1.5",
                  }}
                >
                  {group.description}
                </p>
              </div>

              <div className="card-footer bg-light border-top">
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn btn-sm p-0 text-primary"
                    title="Chỉnh sửa"
                    onClick={() => handleEdit(group)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm p-0 text-danger"
                    title="Xóa"
                    onClick={() => handleDelete(group)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Add
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreate={handleCreate}
      />

      <Edit
        show={showEditModal}
        group={selectedGroup}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGroup(null);
        }}
        onUpdate={handleUpdate}
      />

      <Delete
        show={showDeleteModal}
        group={selectedGroup}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedGroup(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ExamGroupsPage;
