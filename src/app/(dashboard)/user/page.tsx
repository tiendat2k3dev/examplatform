"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import UpdateAvatarModal from "@/components/Profile/UpdateAvatarModal";
import UpdateProfileModal from "@/components/Profile/UpdateProfileModal";
import ChangePasswordModal from "@/components/Profile/ChangePasswordModal";
import styles from "./User.module.css";

const UserPage = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // State kiểm tra hydrate phía client
  const [isMounted, setIsMounted] = useState(false);

  // State quản lý trạng thái đóng/mở 3 Modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Chuyển hướng về Login nếu chưa xác thực
  useEffect(() => {
    if (isMounted && !currentUser) {
      toast.warning("Vui lòng đăng nhập để xem thông tin cá nhân!");
      router.push("/login");
    }
  }, [isMounted, currentUser, router]);

  if (!isMounted || !currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 text-white">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`container-fluid py-4 px-3 px-md-5 my-auto position-relative ${styles.mainContainer}`}
    >
      {/* Vòng tròn phát sáng hiệu ứng nền */}
      <div
        className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle1}`}
      ></div>
      <div
        className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle2}`}
      ></div>

      <div className="row justify-content-center position-relative z-1 w-100 m-0">
        <div className="col-12 p-0">
          {/* Card Profile: Layout nằm ngang, chiều rộng 100% */}
          <div
            className={`card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden w-100 ${styles.profileCard}`}
          >
            <div className="row g-0">
              {/* CỘT TRÁI: Avatar, Tên, Trạng thái & Action Buttons */}
              <div
                className={`col-12 col-lg-4 p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center ${styles.profileHeader}`}
              >
                {/* Khung Avatar Hình Vuông Bo Góc */}
                {/* Khung Avatar */}
                <div
                  role="button"
                  onClick={() => setShowAvatarModal(true)}
                  className={`rounded-4 p-1 border border-info border-2 d-flex align-items-center justify-content-center shadow-lg mb-3 flex-shrink-0 position-relative ${styles.avatarBox}`}
                  title="Nhấn để đổi ảnh đại diện"
                  style={{
                    cursor: "pointer",
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                  }}
                >
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt="User Avatar"
                      className="w-100 h-100 rounded-3 object-fit-contain"
                      style={{ objectFit: "contain" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/150x150/1e293b/white?text=Avatar";
                      }}
                    />
                  ) : (
                    <i
                      className="bi bi-person-badge-fill text-info"
                      style={{ fontSize: "4.5rem" }}
                    ></i>
                  )}

                  {/* Badge biểu tượng Camera */}
                  <div
                    className="position-absolute bottom-0 end-0 bg-info text-dark rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{
                      width: "32px",
                      height: "32px",
                      transform: "translate(20%, 20%)",
                    }}
                  >
                    <i className="bi bi-camera-fill small"></i>
                  </div>
                </div>
                {/* Tên & Role */}
                <h3 className={`fw-bold mb-1 ${styles.titleGradient}`}>
                  {currentUser?.fullName || "Chưa cập nhật"}
                </h3>
                <p className="text-light opacity-75 mb-3 small">
                  Thành Viên Chính Thức &bull; Ngoại Ngữ Xuân Lộc
                </p>
                <span className="badge bg-success bg-opacity-20 text-white border border-success border-opacity-25 px-3 py-2 rounded-pill mb-4">
                  <i className="bi bi-check-circle-fill me-1"></i> Tài khoản đã
                  xác thực
                </span>

                {/* Danh sách 2 nút thao tác */}
                <div className="d-flex flex-column gap-2 w-100 px-lg-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(true)}
                    className={`btn btn-primary fw-bold py-2 px-3 rounded-3 w-100 shadow ${styles.updateBtn}`}
                  >
                    <i className="bi bi-pencil-square me-2"></i>Cập nhật Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="btn btn-outline-info fw-bold py-2 px-3 rounded-3 w-100"
                  >
                    <i className="bi bi-key-fill me-2"></i>Đổi mật khẩu
                  </button>
                </div>
              </div>

              {/* CỘT PHẢI: Khung hiển thị chi tiết các trường thông tin */}
              <div className="col-12 col-lg-8 p-4 p-md-5 d-flex flex-column justify-content-center">
                <h5 className="fw-bold mb-4 text-info d-flex align-items-center gap-2">
                  <i className="bi bi-card-checklist fs-4"></i> Thông Tin Chi
                  Tiết
                </h5>

                <div className="row g-3 w-100 m-0">
                  {/* 1. Tên đăng nhập */}
                  <div className="col-md-6 p-1">
                    <div
                      className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                    >
                      <small className="text-light opacity-50 d-block mb-1">
                        <i className="bi bi-person me-1 text-info"></i> Tên đăng
                        nhập
                      </small>
                      <span className="fw-bold text-white fs-6">
                        {currentUser?.username || "---"}
                      </span>
                    </div>
                  </div>

                  {/* 2. Họ và tên */}
                  <div className="col-md-6 p-1">
                    <div
                      className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                    >
                      <small className="text-light opacity-50 d-block mb-1">
                        <i className="bi bi-card-heading me-1 text-info"></i> Họ
                        và tên
                      </small>
                      <span className="fw-bold text-white fs-6">
                        {currentUser?.fullName || "---"}
                      </span>
                    </div>
                  </div>

                  {/* 3. Email */}
                  <div className="col-md-6 p-1">
                    <div
                      className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                    >
                      <small className="text-light opacity-50 d-block mb-1">
                        <i className="bi bi-envelope me-1 text-info"></i> Địa
                        chỉ Email
                      </small>
                      <span className="fw-bold text-white fs-6">
                        {currentUser?.email || "---"}
                      </span>
                    </div>
                  </div>

                  {/* 4. Số điện thoại */}
                  <div className="col-md-6 p-1">
                    <div
                      className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                    >
                      <small className="text-light opacity-50 d-block mb-1">
                        <i className="bi bi-telephone me-1 text-info"></i> Số
                        điện thoại
                      </small>
                      <span className="fw-bold text-white fs-6">
                        {currentUser?.phone || "---"}
                      </span>
                    </div>
                  </div>

                  {/* 5. Địa chỉ */}
                  <div className="col-12 p-1">
                    <div
                      className={`p-3 rounded-3 border border-secondary border-opacity-25 ${styles.infoBox}`}
                    >
                      <small className="text-light opacity-50 d-block mb-1">
                        <i className="bi bi-geo-alt me-1 text-info"></i> Địa chỉ
                        liên hệ
                      </small>
                      <span className="fw-bold text-white fs-6">
                        {currentUser?.address || "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Modal Chức Năng */}
      <UpdateAvatarModal
        show={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
      <UpdateProfileModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      />
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </main>
  );
};

export default UserPage;
