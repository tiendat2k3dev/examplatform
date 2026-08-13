import Link from "next/link";

const Sidebar = () => {
  return (
    <aside
      className="d-flex flex-column flex-shrink-0 bg-light border-end"
      style={{ width: "200px", height: "100vh" }}
    >
      {/* Logo */}
      <div
        className="d-flex align-items-center px-3"
        style={{ height: "60px" }}
      >
        <h4 className="mb-0 fw-bold text-primary" style={{ fontSize: "17px" }}>
          CodeGym Quiz
        </h4>
      </div>

      {/* Menu */}
      <nav className="d-flex flex-column gap-1 px-2 py-2">
        <Link
          href="/admin"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-house-door me-2" style={{ width: "24px" }}></i>
          <span>Trang chủ</span>
        </Link>

        <Link
          href="/admin/members"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-people me-2" style={{ width: "24px" }}></i>
          <span>Quản lý thành viên</span>
        </Link>

        <Link
          href="/admin/categories"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-folder me-2" style={{ width: "24px" }}></i>
          <span>Quản lý danh mục</span>
        </Link>

        <Link
          href="/admin/exams"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i
            className="bi bi-file-earmark-text me-2"
            style={{ width: "24px" }}
          ></i>
          <span>Quản lý đề thi</span>
        </Link>

        <Link
          href="/admin/questions"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-journal-text me-2" style={{ width: "24px" }}></i>
          <span>Ngân hàng câu hỏi</span>
        </Link>

        <Link
          href="/admin/ranking"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-trophy me-2" style={{ width: "24px" }}></i>
          <span>Xếp hạng</span>
        </Link>

        <Link
          href="/admin/statistics"
          className="d-flex align-items-center text-decoration-none text-dark rounded px-3"
          style={{ height: "40px", fontSize: "13px" }}
        >
          <i className="bi bi-bar-chart me-2" style={{ width: "24px" }}></i>
          <span>Thống kê</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
