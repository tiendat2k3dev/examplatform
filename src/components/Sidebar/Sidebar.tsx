// src/components/Sidebar/Sidebar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/reducers/AuthReducer";
import { toast } from "react-toastify";
import styles from "./Sidebar.module.css";

const menuItems = [
  { label: "Trang Chủ", href: "/", icon: "bi-house-door-fill", requiresAuth: false },
  { label: "Danh Sách Nhóm Đề Thi", href: "/exam-category", icon: "bi-journal-text", requiresAuth: false },
  { label: "Lịch Sử Thi", href: "/history", icon: "bi-clock-history", requiresAuth: true },
  { label: "Xếp Hạng", href: "/leaderboard", icon: "bi-trophy-fill", requiresAuth: true },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // Xử lý sự kiện click menu
  const handleNavClick = (e: React.MouseEvent, item: typeof menuItems[0]) => {
    // Nếu trang yêu cầu đăng nhập mà người dùng chưa đăng nhập
    if (item.requiresAuth && !currentUser) {
      e.preventDefault(); // Ngăn chuyển trang
      toast.warning("Vui lòng đăng nhập để xem " + item.label.toLowerCase() + "!");
      router.push("/login");
    }
  };

  return (
    <aside
      className={`d-none d-md-flex flex-column ${styles.sidebarContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      {/* HEADER SIDEBAR: Chữ MENU & Nút Toggle */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        <span
          className={`fw-bold text-muted text-uppercase m-0 ${styles.hideOnCollapse}`}
          style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
        >
          MENU
        </span>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`btn btn-sm btn-light border shadow-sm rounded-2 d-flex align-items-center justify-content-center p-1.5 ${styles.toggleBtn}`}
          title={isCollapsed ? "Mở rộng Sidebar" : "Thu gọn Sidebar"}
        >
          <i
            className={`bi ${
              isCollapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"
            } fs-6 text-primary`}
          ></i>
        </button>
      </div>

      {/* DANH SÁCH MENU */}
      <div className="p-2 flex-grow-1 overflow-y-auto">
        <nav className="d-flex flex-column gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
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

      {/* NÚT ĐĂNG XUẤT */}
      {currentUser && (
        <div className="p-3 border-top mt-auto">
          <button
            onClick={handleLogout}
            className={`btn w-100 py-2 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 ${styles.logoutBtn}`}
            title={isCollapsed ? "Đăng Xuất" : ""}
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span className={styles.hideOnCollapse}>Đăng Xuất</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;