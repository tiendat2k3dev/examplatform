
const Footer = () => {
  return (
    <footer className={`bg-light text-dark border-top py-4 mt-auto`}>
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <i className="bi bi-code-slash text-primary fs-5"></i>
              <span className="fw-bold text-dark">RMS Exam Platform v3.0</span>
            </div>
            <small className="text-secondary">&copy; 2026 Resource Management System. All rights reserved.</small>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3 text-secondary small">
              <a href="#" className="text-secondary text-decoration-none fw-semibold">Điều khoản sử dụng</a>
              <span>&bull;</span>
              <a href="#" className="text-secondary text-decoration-none fw-semibold">Chính sách bảo mật</a>
              <span>&bull;</span>
              <a href="#" className="text-secondary text-decoration-none fw-semibold">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;