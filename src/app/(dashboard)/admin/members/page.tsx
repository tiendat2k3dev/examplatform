"use client";

import { useEffect, useState } from "react";
import HeaderMembers from "@/components/members/HeaderMembers";
import CreateMembersModal from "@/components/modal/members/add/CreateMembersModal";
import EditMembersModal from "@/components/modal/members/edit/EditMembersModal";
import DeleteMembersModal from "@/components/modal/members/delete/DeleteMembesModal";
import ConfirmModal from "@/components/modal/common/ConfirmModal";
import { toast } from "react-toastify";
import { User } from "@/types/user";
import {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "../../../../services/userService";

const MembersPage = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // MODAL
  // =========================
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // =========================
  // TOGGLE STATUS
  // =========================
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);

  const [pendingToggleMember, setPendingToggleMember] = useState<User | null>(
    null,
  );

  // =========================
  // SEARCH + FILTER
  // =========================
  // Giá trị người dùng đang nhập/chọn
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Giá trị thực tế đang được áp dụng
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState("");
  const [appliedRoleFilter, setAppliedRoleFilter] = useState("");

  // =========================
  // LẤY DANH SÁCH USER
  // =========================
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

  // =========================
  // LỌC + TÌM KIẾM USER
  // =========================
  const filteredMembers = members.filter((member) => {
    const search = appliedSearchTerm.toLowerCase().trim();

    // Tìm kiếm theo họ tên, username, email
    const matchesSearch =
      search === "" ||
      member.fullName.toLowerCase().includes(search) ||
      member.username.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);

    // Lọc trạng thái
    const matchesStatus =
      appliedStatusFilter === "" || member.status === appliedStatusFilter;

    // Lọc vai trò
    const matchesRole =
      appliedRoleFilter === "" || member.role === appliedRoleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // =========================
  // TÌM KIẾM / LỌC
  // =========================
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedStatusFilter(statusFilter);
    setAppliedRoleFilter(roleFilter);
  };

  // =========================
  // THÊM USER
  // =========================
  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleCreate = async (member: User) => {
    try {
      const newMember = await createUserService(member);

      setMembers((prev) => [newMember, ...prev]);

      setShowCreateModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);

      // Không hiển thị toast ở đây
      // Modal sẽ tự hiển thị thông báo lỗi
    }
  };

  // =========================
  // SỬA USER
  // =========================
  const handleEdit = (member: User) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

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
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  // =========================
  // XÓA USER
  // =========================
  const handleDelete = (member: User) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

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
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  // =========================
  // ĐỔI TRẠNG THÁI USER
  // =========================
  const handleToggleClick = (member: User) => {
    setPendingToggleMember(member);
    setShowToggleConfirm(true);
  };

  const handleConfirmToggle = async () => {
    if (!pendingToggleMember) {
      return;
    }

    const member = pendingToggleMember;
    const newStatus = member.status === "Mở" ? "Khóa" : "Mở";

    try {
      // Gọi API cập nhật trạng thái vào db.json
      await updateUserService(member.id, { status: newStatus });

      // Chỉ cập nhật local state khi API thành công
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
      // Giữ modal mở để người dùng thử lại
    }
  };

  // =========================
  // ĐÓNG MODAL TOGGLE
  // =========================
  const handleCloseToggleConfirm = () => {
    setShowToggleConfirm(false);
    setPendingToggleMember(null);
  };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      {/* =========================
          HEADER
      ========================= */}
      <HeaderMembers
        title="Quản lý người dùng"
        description="Quản lý tài khoản"
        add="Thêm người dùng"
        onAdd={handleAdd}
      />

      {/* =========================
          SEARCH + FILTER
      ========================= */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            {/* SEARCH */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm kiếm theo tên, username hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onChange={(e) => setRoleFilter(e.target.value)}
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
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          TABLE
      ========================= */}
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

                  <th className="text-uppercase small text-muted text-center">
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
                {/* =========================
                    LOADING
                ========================= */}
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
                ) : filteredMembers.length === 0 ? (
                  /* =========================
                     EMPTY
                  ========================= */
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      Không có người dùng nào.
                    </td>
                  </tr>
                ) : (
                  /* =========================
                     DATA
                  ========================= */
                  filteredMembers.map((member, index) => {
                    const isActive = member.status === "Mở";

                    return (
                      <tr key={member.id}>
                        {/* STT */}
                        <td className="text-center text-muted">{index + 1}</td>

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

                        {/* ĐỊA CHỈ */}
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

                        {/* ACTIONS */}
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* EDIT */}
                            <button
                              type="button"
                              className="btn btn-sm btn-light text-primary"
                              title="Chỉnh sửa"
                              onClick={() => handleEdit(member)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              className="btn btn-sm btn-light text-danger"
                              title="Xóa"
                              onClick={() => handleDelete(member)}
                            >
                              <i className="bi bi-trash"></i>
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

          {/* =========================
              PAGINATION
          ========================= */}
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
            <small className="text-muted">
              Hiển thị{" "}
              {filteredMembers.length > 0 ? `1-${filteredMembers.length}` : "0"}{" "}
              trong tổng {filteredMembers.length} người dùng
            </small>

            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <button type="button" className="page-link">
                    Previous
                  </button>
                </li>

                <li className="page-item active">
                  <button type="button" className="page-link">
                    1
                  </button>
                </li>

                <li className="page-item">
                  <button type="button" className="page-link">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* =========================
          CREATE MODAL
      ========================= */}
      <CreateMembersModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* =========================
          EDIT MODAL
      ========================= */}
      <EditMembersModal
        show={showEditModal}
        member={selectedMember}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
        }}
        onUpdate={handleUpdate}
      />

      {/* =========================
          DELETE MODAL
      ========================= */}
      <DeleteMembersModal
        show={showDeleteModal}
        member={selectedMember}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* =========================
          TOGGLE STATUS CONFIRM
      ========================= */}
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
    </div>
  );
};

export default MembersPage;
