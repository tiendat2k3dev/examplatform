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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // Nếu là Admin, không hiển thị Navbar
  if (mounted && currentUser?.role === "Admin") {
    return null;
  }

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
            {!mounted ? (
              <div style={{ height: "35px" }}></div>
            ) : currentUser ? (
              // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP (USER THƯỜNG)
              <div className="d-flex align-items-center gap-3">
                {/* Bấm vào Avatar + Tên để vào trang Profile */}
                <Link
                  href="/user"
                  className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                  title="Xem hồ sơ cá nhân"
                >
                  <div
                    className={`rounded-circle border border-primary border-opacity-50 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0 ${styles.navAvatarBox}`}
                  >
                    {currentUser?.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt="Avatar"
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100/1e293b/white?text=Avatar";
                        }}
                      />
                    ) : (
                      <i className="bi bi-person-fill text-primary fs-5"></i>
                    )}
                  </div>
                  <span className="fw-semibold small">
                    {currentUser.role}:{" "}
                    <span className="text-primary">
                      {currentUser.fullName || currentUser.username}
                    </span>
                  </span>
                </Link>

                {/* Nút Đăng xuất */}
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