import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;