"use client";

import { useState } from "react";
import Image from "next/image";
import HeaderMembers from "@/components/members/HeaderMembers";
import CreateMembersModal from "@/components/modal/members/add/CreateMembersModal";
import EditMembersModal from "@/components/modal/members/edit/EditMembersModal";
import DeleteMembersModal from "@/components/modal/members/delete/DeleteMembesModal";
import { toast } from "react-toastify";

interface Member {
  id: number;
  username: string;
  password: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  img: string;
  role: string;
  status: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      username: "nguyenvana",
      password: "123456",
      fullName: "Nguyễn Văn A",
      address: "Quận Tân Phú, TP. HCM",
      phone: "0912 345 678",
      email: "a.nguyen@edubank.edu.vn",
      img: "/images/avatar-1.jpg",
      role: "Admin",
      status: "Mở khóa",
    },
    {
      id: 2,
      username: "tranthib",
      password: "123456",
      fullName: "Trần Thị B",
      address: "Quận 3, TP. HCM",
      phone: "0987 654 321",
      email: "b.tran@edubank.edu.vn",
      img: "/images/avatar-2.jpg",
      role: "Member",
      status: "Khóa",
    },
    {
      id: 3,
      username: "levanc",
      password: "123456",
      fullName: "Lê Văn C",
      address: "Quận Cầu Giấy, Hà Nội",
      phone: "0901 222 333",
      email: "c.le@student.edubank.edu.vn",
      img: "",
      role: "Member",
      status: "Mở khóa",
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleCreate = (member: Member) => {
    setMembers((prev) => [member, ...prev]);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleUpdate = (updated: Member) => {
    setMembers((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedMember) {
      return;
    }

    setMembers((prev) =>
      prev.filter((item) => item.id !== selectedMember.id)
    );

    toast.success("Xóa người dùng thành công!");
    setShowDeleteModal(false);
    setSelectedMember(null);
  };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      {/* Header */}
      <HeaderMembers
        title="Quản lý người dùng"
        description="Quản lý tài khoản"
        add="Thêm người dùng"
        onAdd={handleAdd}
      />

      {/* Search + Filter */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            {/* Search */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-md-3">
              <select className="form-select">
                <option>Tất cả trạng thái</option>
                <option>Mở khóa</option>
                <option>Khóa</option>
              </select>
            </div>

            {/* Role */}
            <div className="col-md-3">
              <select className="form-select">
                <option>Tất cả vai trò</option>
                <option>Admin</option>
                <option>Member</option>
              </select>
            </div>

            {/* Filter button */}
            <div className="col-md-1">
              <button className="btn btn-outline-secondary w-100">
                <i className="bi bi-funnel"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    className="text-center text-uppercase small text-muted"
                    style={{ width: "60px" }}
                  >
                    STT
                  </th>

                  <th className="text-uppercase small text-muted">Họ tên</th>

                  <th className="text-uppercase small text-muted">Địa chỉ</th>

                  <th className="text-uppercase small text-muted">
                    Số điện thoại
                  </th>

                  <th className="text-uppercase small text-muted">Email</th>

                  <th className="text-uppercase small text-muted">Vai trò</th>

                  <th className="text-uppercase small text-muted">
                    Trạng thái
                  </th>

                  <th
                    className="text-center text-uppercase small text-muted"
                    style={{ width: "120px" }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id}>
                    {/* STT */}
                    <td className="text-center text-muted">{index + 1}</td>

                    {/* Họ tên */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {member.img ? (
                          member.img.startsWith("blob:") ? (
                            <img
                              src={member.img}
                              alt={member.fullName}
                              width={40}
                              height={40}
                              className="rounded-circle object-fit-cover"
                            />
                          ) : (
                            <Image
                              src={member.img}
                              alt={member.fullName}
                              width={40}
                              height={40}
                              className="rounded-circle object-fit-cover"
                            />
                          )
                        ) : (
                          <div
                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-semibold"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            {member.fullName.charAt(0)}
                          </div>
                        )}

                        <div>
                          <div className="fw-semibold text-dark">
                            {member.fullName}
                          </div>

                          <div className="small text-muted">
                            {member.username}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Địa chỉ */}
                    <td className="small text-muted">{member.address}</td>

                    {/* Phone */}
                    <td className="small text-muted">{member.phone}</td>

                    {/* Email */}
                    <td className="small">{member.email}</td>

                    {/* Role */}
                    <td>
                      <span
                        className={`badge rounded-pill fw-normal ${
                          member.role === "Admin"
                            ? "bg-primary-subtle text-primary"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`badge rounded-pill fw-normal ${
                          member.status === "Mở khóa"
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-light text-primary"
                          title="Chỉnh sửa"
                          onClick={() => handleEdit(member)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-light text-danger"
                          title="Xóa"
                          onClick={() => handleDelete(member)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer pagination */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
            <small className="text-muted">
              Hiển thị 1-{members.length} trong tổng {members.length} người dùng
            </small>

            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <button className="page-link">Previous</button>
                </li>

                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>

                <li className="page-item">
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <CreateMembersModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* Edit Modal */}
      <EditMembersModal
        show={showEditModal}
        member={selectedMember}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
        }}
        onUpdate={handleUpdate}
      />

      {/* Delete Modal */}
      <DeleteMembersModal
        show={showDeleteModal}
        member={selectedMember}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MembersPage;
