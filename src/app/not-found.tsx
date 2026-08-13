import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>

        <h2 className="mb-3">Không tìm thấy trang</h2>

        <p className="text-muted mb-4">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>

        <Link href="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2"></i>
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
