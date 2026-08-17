// src/components/Sidebar/Sidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/reducers/AuthReducer";
import { AvatarPreviewModal } from "./AvatarPreviewModal";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    label: "Trang Chủ",
    href: "/",
    icon: "bi-house-door-fill",
    requiresAuth: false,
  },
  {
    label: "Danh Sách Nhóm Đề Thi",
    href: "/exam-group",
    icon: "bi-journal-text",
    requiresAuth: false,
  },
  {
    label: "Lịch Sử Thi",
    href: "/history",
    icon: "bi-clock-history",
    requiresAuth: true,
  },
  {
    label: "Xếp Hạng",
    href: "/leaderboard",
    icon: "bi-trophy-fill",
    requiresAuth: true,
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  if (currentUser?.role === "Admin") {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const visibleMenuItems = menuItems.filter(
    (item) => !item.requiresAuth || Boolean(currentUser),
  );

  const finalAvatarUrl =
    currentUser?.avatarUrl ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(currentUser?.fullName || "Guest") +
      "&background=0b132b&color=00d2ff";

  return (
    <>
      <aside
        className={`d-none d-md-flex flex-column ${styles.sidebarContainer} ${
          isCollapsed ? styles.collapsed : ""
        }`}
      >
        {/* HEADER SIDEBAR */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <span
            className={`fw-bold text-muted text-uppercase m-0 ${styles.hideOnCollapse}`}
            style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
          >
            MENU
          </span>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`btn btn-sm btn-light border shadow-sm rounded-2 d-flex align-items-center justify-content-center p-1 ${styles.toggleBtn}`}
            title={isCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
          >
            <i
              className={`bi ${
                isCollapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
              } fs-6 text-primary`}
            ></i>
          </button>
        </div>

        {/* USER CARD: Click để mở Avatar Modal */}
        <div className="p-2 border-bottom">
          <div
            onClick={() => setShowAvatarModal(true)}
            className={`d-flex align-items-center gap-2 p-2 ${styles.profileCardCompact}`}
            title="Nhấn để xem ảnh đại diện"
          >
            {/* Avatar vuông bo góc nhỏ */}
            <div className={styles.avatarBoxSmall}>
              <img
                src={finalAvatarUrl}
                alt={currentUser?.fullName || "Avatar"}
                className={styles.avatarImg}
              />
              <div className={styles.cameraBadgeSmall}>
                <i className="bi bi-camera-fill"></i>
              </div>
            </div>

            {/* Tên & Role */}
            <div className={`d-flex flex-column ${styles.hideOnCollapse}`}>
              <span className={`fw-bold small ${styles.userNameText}`}>
                {currentUser ? currentUser.fullName : "Khách Vãng Lai"}
              </span>
              <div className="mt-0.5">
                {currentUser ? (
                  <span
                    className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-0.5"
                    style={{ fontSize: "0.68rem" }}
                  >
                    <i className="bi bi-patch-check-fill me-1"></i>
                    {currentUser.role || "Member"}
                  </span>
                ) : (
                  <span
                    className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill px-1.5 py-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    <i className="bi bi-globe me-1"></i> Public
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DANH SÁCH MENU */}
        <div className="p-2 flex-grow-1 overflow-y-auto">
          <nav className="d-flex flex-column gap-1">
            {visibleMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.activeNavLink : ""
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span className={`small ${styles.hideOnCollapse}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* NÚT ĐĂNG XUẤT / ĐĂNG NHẬP */}
        <div className="p-3 border-top mt-auto">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className={`btn w-100 py-2 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 ${styles.logoutBtn}`}
              title={isCollapsed ? "Đăng Xuất" : ""}
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
              <span className={styles.hideOnCollapse}>Đăng Xuất</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary w-100 py-2 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 shadow-sm"
              title={isCollapsed ? "Đăng Nhập" : ""}
            >
              <i className="bi bi-box-arrow-in-right fs-5"></i>
              <span className={styles.hideOnCollapse}>Đăng Nhập</span>
            </Link>
          )}
        </div>
      </aside>

      {/* MODAL XEM AVATAR */}
      <AvatarPreviewModal
        show={showAvatarModal}
        avatarUrl={finalAvatarUrl}
        fullName={currentUser ? currentUser.fullName : "Khách Vãng Lai"}
        role={currentUser ? currentUser.role : "Public"}
        onClose={() => setShowAvatarModal(false)}
      />
    </>
  );
};

export default Sidebar;