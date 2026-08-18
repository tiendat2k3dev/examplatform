"use client";

import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import HeaderMembers from "@/components/members/HeaderMembers";

import CreateMembersModal from "@/components/modal/members/add/CreateMembersModal";

import EditMembersModal from "@/components/modal/members/edit/EditMembersModal";

import DeleteMembersModal from "@/components/modal/members/delete/DeleteMembesModal";

import ConfirmModal from "@/components/modal/common/ConfirmModal";

import { User } from "@/types/user";

import {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../../../../services/userService";

const MembersPage = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [members, setMembers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // MODAL
  // =====================================================

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const [showToggleConfirm, setShowToggleConfirm] = useState(false);

  const [pendingToggleMember, setPendingToggleMember] = useState<User | null>(
    null,
  );

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");

  const [appliedRoleFilter, setAppliedRoleFilter] = useState("");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // =====================================================
  // LẤY DANH SÁCH USER
  // =====================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await getUsersService();

        setMembers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);

        toast.error("Không thể tải danh sách người dùng!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredMembers = members.filter((member) => {
    const search = appliedSearchTerm.toLowerCase().trim();

    const matchesSearch =
      search === "" ||
      (member.fullName ?? "").toLowerCase().includes(search) ||
      (member.address ?? "").toLowerCase().includes(search) ||
      (member.phone ?? "").toLowerCase().includes(search) ||
      (member.email ?? "").toLowerCase().includes(search);

    const matchesStatus =
      appliedStatusFilter === "" || member.status === appliedStatusFilter;

    const matchesRole =
      appliedRoleFilter === "" || member.role === appliedRoleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);

    setAppliedStatusFilter(statusFilter);

    setAppliedRoleFilter(roleFilter);

    setCurrentPage(1);
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
  // PAGINATION
  // =====================================================

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // =====================================================
  // MỞ MODAL THÊM
  // =====================================================

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  // =====================================================
  // THÊM USER
  // =====================================================

  const handleCreate = async (member: User) => {
    try {
      const newMember = await createUserService(member);

      // Thêm user mới vào đầu danh sách
      setMembers((prev) => [newMember, ...prev]);

      // Đóng modal
      setShowCreateModal(false);

      // Về trang đầu
      setCurrentPage(1);

      // Thông báo thành công
      toast.success("Thêm người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);

      // =================================================
      // XỬ LÝ USERNAME TRÙNG
      // =================================================

      if (error instanceof Error) {
        if (error.message.startsWith("USERNAME_EXISTS:")) {
          const username = error.message.substring("USERNAME_EXISTS:".length);

          toast.error(`Tên đăng nhập "${username}" đã tồn tại!`);

          return;
        }

        // ===============================================
        // XỬ LÝ EMAIL TRÙNG
        // ===============================================

        if (error.message.startsWith("EMAIL_EXISTS:")) {
          const email = error.message.substring("EMAIL_EXISTS:".length);

          toast.error(`Email "${email}" đã tồn tại!`);

          return;
        }

        // ===============================================
        // XỬ LÝ PHONE TRÙNG
        // ===============================================

        if (error.message.startsWith("PHONE_EXISTS:")) {
          const phone = error.message.substring("PHONE_EXISTS:".length);

          toast.error(`Số điện thoại "${phone}" đã tồn tại!`);

          return;
        }
      }

      // =================================================
      // LỖI KHÁC
      // =================================================

      toast.error("Không thể thêm người dùng!");
    }
  };

  // =====================================================
  // SỬA USER
  // =====================================================

  const handleEdit = (member: User) => {
    setSelectedMember(member);

    setShowEditModal(true);
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const handleUpdate = async (updated: User) => {
    try {
      const updatedMember = await updateUserService(updated.id, updated);

      setMembers((prev) =>
        prev.map((item) =>
          item.id === updatedMember.id ? updatedMember : item,
        ),
      );
      setShowEditModal(false);
      setSelectedMember(null);
      toast.success("Cập nhật người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);

      // Xử lý lỗi trùng lặp từ service (fallback cho race condition)

      if (error instanceof Error) {
        if (error.message.startsWith("USERNAME_EXISTS:")) {
          const username = error.message.substring("USERNAME_EXISTS:".length);

          toast.error(`Tên đăng nhập "${username}" đã tồn tại!`);

          return;
        }

        if (error.message.startsWith("EMAIL_EXISTS:")) {
          const email = error.message.substring("EMAIL_EXISTS:".length);

          toast.error(`Email "${email}" đã tồn tại!`);

          return;
        }

        if (error.message.startsWith("PHONE_EXISTS:")) {
          const phone = error.message.substring("PHONE_EXISTS:".length);

          toast.error(`Số điện thoại "${phone}" đã tồn tại!`);

          return;
        }
      }

      toast.error("Không thể cập nhật người dùng!");
    }
  };

  // =====================================================
  // XÓA USER
  // =====================================================

  const handleDelete = (member: User) => {
    setSelectedMember(member);

    setShowDeleteModal(true);
  };

  // =====================================================
  // XÁC NHẬN XÓA
  // =====================================================

  const handleConfirmDelete = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      await deleteUserService(selectedMember.id);

      setMembers((prev) =>
        prev.filter((item) => item.id !== selectedMember.id),
      );

      setShowDeleteModal(false);

      setSelectedMember(null);

      toast.success("Xóa người dùng thành công!");

      const newTotal = filteredMembers.length - 1;

      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));

      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);

      toast.error("Không thể xóa người dùng!");
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const handleToggleClick = (member: User) => {
    setPendingToggleMember(member);

    setShowToggleConfirm(true);
  };

  // =====================================================
  // CONFIRM TOGGLE
  // =====================================================

  const handleConfirmToggle = async () => {
    if (!pendingToggleMember) {
      return;
    }

    const member = pendingToggleMember;

    const newStatus = member.status === "Mở" ? "Khóa" : "Mở";

    try {
      await updateUserService(member.id, {
        status: newStatus,
      });

      setMembers((prev) =>
        prev.map((item) =>
          item.id === member.id
            ? {
                ...item,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      toast.success(
        newStatus === "Mở"
          ? `Đã mở khóa tài khoản ${member.fullName}!`
          : `Đã khóa tài khoản ${member.fullName}!`,
      );

      setShowToggleConfirm(false);

      setPendingToggleMember(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);

      toast.error("Không thể cập nhật trạng thái tài khoản!");
    }
  };

  // =====================================================
  // CLOSE TOGGLE
  // =====================================================

  const handleCloseToggleConfirm = () => {
    setShowToggleConfirm(false);

    setPendingToggleMember(null);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      {/* =================================================
          HEADER
      ================================================= */}

      <HeaderMembers
        title="Quản lý người dùng"
        description="Quản lý tài khoản"
        add="Thêm người dùng"
        onAdd={handleAdd}
      />

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            {/* SEARCH */}

            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted" />
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm kiếm theo họ tên, địa chỉ, SĐT hoặc email..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>

            {/* STATUS */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">Tất cả trạng thái</option>

                <option value="Mở">Mở</option>

                <option value="Khóa">Khóa</option>
              </select>
            </div>

            {/* ROLE */}

            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
              >
                <option value="">Tất cả vai trò</option>

                <option value="Admin">Admin</option>

                <option value="Member">Member</option>
              </select>
            </div>

            {/* SEARCH BUTTON */}

            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                title="Tìm kiếm"
                onClick={handleSearch}
              >
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    className="text-center text-uppercase small text-muted"
                    style={{
                      width: "60px",
                    }}
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

                  <th className="text-uppercase small text-muted text-center">
                    Trạng thái
                  </th>

                  <th
                    className="text-center text-uppercase small text-muted"
                    style={{
                      width: "120px",
                    }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Đang tải danh sách người dùng...
                    </td>
                  </tr>
                ) : paginatedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      Không có người dùng nào.
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member, index) => {
                    const isActive = member.status === "Mở";

                    return (
                      <tr key={member.id}>
                        {/* STT */}

                        <td className="text-center text-muted">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>

                        {/* HỌ TÊN */}

                        <td>
                          <div>
                            <div className="fw-semibold text-dark">
                              {member.fullName}
                            </div>

                            <div className="small text-muted">
                              {member.username}
                            </div>
                          </div>
                        </td>

                        {/* ADDRESS */}

                        <td className="small text-muted">{member.address}</td>

                        {/* PHONE */}

                        <td className="small text-muted">{member.phone}</td>

                        {/* EMAIL */}

                        <td className="small">{member.email}</td>

                        {/* ROLE */}

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

                        {/* STATUS */}

                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div className="form-check form-switch mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={isActive}
                                onChange={() => handleToggleClick(member)}
                                style={{
                                  cursor: "pointer",
                                  width: "40px",
                                  height: "20px",
                                }}
                              />
                            </div>

                            <span
                              className={`badge rounded-pill fw-normal ${
                                isActive
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              }`}
                            >
                              {member.status}
                            </span>
                          </div>
                        </td>

                        {/* ACTION */}

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-light text-primary"
                              title="Chỉnh sửa"
                              onClick={() => handleEdit(member)}
                            >
                              <i className="bi bi-pencil" />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-light text-danger"
                              title="Xóa"
                              onClick={() => handleDelete(member)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
            <small className="text-muted">
              Hiển thị{" "}
              {filteredMembers.length > 0
                ? `${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    filteredMembers.length,
                  )}`
                : "0"}{" "}
              trong tổng {filteredMembers.length} người dùng
            </small>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredMembers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              size="small"
            />
          </div>
        </div>
      </div>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      <CreateMembersModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      <EditMembersModal
        show={showEditModal}
        member={selectedMember}
        onClose={() => {
          setShowEditModal(false);

          setSelectedMember(null);
        }}
        onUpdate={handleUpdate}
      />

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <DeleteMembersModal
        show={showDeleteModal}
        member={selectedMember}
        onClose={() => {
          setShowDeleteModal(false);

          setSelectedMember(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* =================================================
          TOGGLE CONFIRM
      ================================================= */}

      <ConfirmModal
        show={showToggleConfirm}
        onClose={handleCloseToggleConfirm}
        onConfirm={handleConfirmToggle}
        title={
          pendingToggleMember
            ? pendingToggleMember.status === "Mở"
              ? `Bạn có chắc muốn khóa tài khoản "${pendingToggleMember.fullName}" không?`
              : `Bạn có chắc muốn mở khóa tài khoản "${pendingToggleMember.fullName}" không?`
            : "Bạn có chắc muốn thay đổi trạng thái tài khoản này không?"
        }
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MembersPage;
