// src/components/Navbar/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/reducers/AuthReducer";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // State kiểm tra xem component đã mount trên client chưa
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-3 shadow-sm ${styles.customNavbar}`}
    >
      <div className="container">
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 m-0 text-decoration-none"
        >
          <div className={styles.brandIconContainer}>
            <i className="bi bi-code-slash fs-4"></i>
          </div>
          <span className={styles.brandText}>
            CodeGym <span className="text-primary">Exam IT</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end mt-3 mt-lg-0"
          id="navbarContent"
        >
          <div className="d-flex align-items-center gap-3">
            {/* Tránh render khác biệt giữa SSR và Client bằng cách check mounted */}
            {!mounted ? (
              <div style={{ height: "35px" }}></div> // Khoảng trống giữ chỗ khi đang render trên server
            ) : currentUser ? (
              // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
              <div className="d-flex align-items-center gap-3">
                <span className="fw-semibold text-dark small">
                  {currentUser.role}:{" "}
                  <span className="text-primary">
                    {currentUser.fullName || currentUser.username}
                  </span>
                </span>

                <Link
                  href={currentUser.role === "Admin" ? "/admin" : "/user"}
                  className="btn btn-outline-primary btn-sm px-3 py-1.5 fw-semibold rounded-pill text-decoration-none d-flex align-items-center gap-1"
                >
                  <i className="bi bi-person-circle"></i> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm px-3 py-1.5 fw-semibold rounded-pill d-flex align-items-center gap-1"
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            ) : (
              // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
              <div className="d-flex align-items-center gap-2">
                <Link
                  href="/login"
                  className="btn btn-outline-dark btn-sm px-3 py-2 fw-semibold rounded-pill text-decoration-none"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className={`btn btn-primary btn-sm px-3 py-2 fw-bold rounded-pill text-decoration-none ${styles.registerBtn}`}
                >
                  <i className="bi bi-person-plus-fill me-1"></i> Đăng Ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
