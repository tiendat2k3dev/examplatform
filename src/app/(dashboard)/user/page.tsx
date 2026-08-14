// src/app/(dashboard)/user/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import UpdateProfileModal from "@/components/Profile/UpdateProfileModal";
import ChangePasswordModal from "@/components/Profile/ChangePasswordModal";
import styles from "./User.module.css";

const UserPage = () => {
  const router = useRouter();
  // Lấy thông tin người dùng từ Redux store
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // State kiểm tra đã hydrate client hay chưa
  const [isMounted, setIsMounted] = useState(false);

  // State quản lý trạng thái đóng/mở modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ÉP QUAY LẠI TRANG LOGIN NẾU CHƯA ĐĂNG NHẬP
  useEffect(() => {
    if (isMounted && !currentUser) {
      toast.warning("Vui lòng đăng nhập để xem thông tin cá nhân!");
      router.push("/login");
    }
  }, [isMounted, currentUser, router]);

  // Nếu chưa mounted hoặc không có user, hiển thị màn hình chờ (để tránh nháy UI)
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
      className={`container-fluid py-5 px-3 px-md-5 my-auto position-relative ${styles.mainContainer}`}
    >
      {/* Vòng tròn phát sáng trang trí nền */}
      <div
        className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle1}`}
      ></div>
      <div
        className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle2}`}
      ></div>

      <div className="row justify-content-center position-relative z-1">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          {/* Card Profile Container */}
          <div
            className={`card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden ${styles.profileCard}`}
          >
            {/* Header Hồ Sơ */}
            <div
              className={`p-4 p-md-5 border-bottom border-secondary border-opacity-25 text-center text-sm-start ${styles.profileHeader}`}
            >
              <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
                {/* Avatar Icon */}
                <div
                  className={`rounded-circle p-1 border border-info border-2 d-flex align-items-center justify-content-center shadow-lg flex-shrink-0 ${styles.avatarBox}`}
                >
                  <i
                    className="bi bi-person-badge-fill text-info"
                    style={{ fontSize: "3.5rem" }}
                  ></i>
                </div>

                {/* Tên & Trạng Thái */}
                <div>
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                    <h2 className={`fw-bold m-0 ${styles.titleGradient}`}>
                      {currentUser?.fullName || "Chưa cập nhật"}
                    </h2>
                  </div>
                  <p className="text-light opacity-75 mb-2">
                    Thành Viên Chính Thức &bull; Hệ Thống RMS Exam IT
                  </p>
                  <span className="badge bg-success bg-opacity-20 text-white border border-success border-opacity-25 px-3 py-2 rounded-pill">
                    <i className="bi bi-check-circle-fill me-1"></i> Tài khoản
                    đã xác thực
                  </span>
                </div>
              </div>
            </div>

            {/* Body Chi Tiết Thông Tin Đăng Ký */}
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4 text-info d-flex align-items-center gap-2">
                <i className="bi bi-card-checklist fs-4"></i> Thông Tin Đã Đăng
                Ký
              </h5>

              <div className="row g-3 mb-4">
                {/* 1. Username */}
                <div className="col-md-6">
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

                {/* 2. Full Name */}
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <div
                    className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                  >
                    <small className="text-light opacity-50 d-block mb-1">
                      <i className="bi bi-envelope me-1 text-info"></i> Địa chỉ
                      Email
                    </small>
                    <span className="fw-bold text-white fs-6">
                      {currentUser?.email || "---"}
                    </span>
                  </div>
                </div>

                {/* 4. Phone Number */}
                <div className="col-md-6">
                  <div
                    className={`p-3 rounded-3 border border-secondary border-opacity-25 h-100 ${styles.infoBox}`}
                  >
                    <small className="text-light opacity-50 d-block mb-1">
                      <i className="bi bi-telephone me-1 text-info"></i> Số điện
                      thoại
                    </small>
                    <span className="fw-bold text-white fs-6">
                      {currentUser?.phone || "---"}
                    </span>
                  </div>
                </div>

                {/* 5. Address */}
                <div className="col-12">
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

              {/* HÀNG CHỨA 2 NÚT CẬP NHẬT */}
              <div className="d-flex flex-column flex-sm-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(true)}
                  className={`btn btn-primary fw-bold py-2 px-4 rounded-3 flex-fill shadow ${styles.updateBtn}`}
                >
                  <i className="bi bi-pencil-square me-2"></i>Cập nhật Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="btn btn-outline-info fw-bold py-2 px-4 rounded-3 flex-fill"
                >
                  <i className="bi bi-key-fill me-2"></i>Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cập Nhật Profile */}
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
