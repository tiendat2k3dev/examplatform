import Link from "next/link";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  return (
    <div className="row justify-content-center position-relative z-1 w-100 m-0">
      {/* Mở rộng col thành 100% (col-12) và tăng kích thước tối đa để form rộng rãi */}
      <div className="col-12 col-lg-10 col-xl-9 px-0">
        <div
          className={`card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden ${styles.loginCard}`}
        >
          <div className="card-body p-3 p-sm-4 p-md-5">
            {/* Chia làm 2 cột: Cột trái (Icon + Title), Cột phải (Inputs + Button) */}
            <div className="row align-items-center g-4">
              
              {/* CỘT TRÁI: Icon, Tiêu đề và Mô tả */}
              <div className="col-lg-5 text-center text-lg-start border-end-lg border-secondary border-opacity-25 pe-lg-4">
                <div
                  className={`d-inline-flex p-3 rounded-circle text-info border border-info border-opacity-50 mb-3 shadow-sm ${styles.iconHeaderBox}`}
                >
                  <i className="bi bi-person-fill fs-2"></i>
                </div>
                <h3 className={`fw-bold mb-2 ${styles.titleGradient}`}>
                  Đăng Nhập
                </h3>
                <p className="text-light opacity-75 small mb-0">
                  Nhập thông tin tài khoản của bạn để truy cập hệ thống thi trắc nghiệm IT trực tuyến.
                </p>
              </div>

              {/* CỘT PHẢI: Các trường nhập liệu và nút submit */}
              <div className="col-lg-7 ps-lg-4">
                <form>
                  {/* Tên đăng nhập */}
                  <div className="mb-2">
                    <label
                      htmlFor="username"
                      className="form-label small fw-bold text-light opacity-90 mb-1"
                    >
                      Tên đăng nhập
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info py-1">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                        id="username"
                        placeholder="Nhập username..."
                        required
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="form-label small fw-bold text-light opacity-90 mb-1"
                    >
                      Mật khẩu
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border border-secondary border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info py-1">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                        id="password"
                        placeholder="Nhập mật khẩu..."
                        required
                      />
                    </div>
                  </div>

                  {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check m-0">
                      <input
                        className="form-check-input bg-dark border-secondary"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label small text-light opacity-75"
                        htmlFor="rememberMe"
                      >
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <a href="#" className="text-info small text-decoration-none">
                      Quên mật khẩu?
                    </a>
                  </div>

                  {/* Nút submit */}
                  <div className="d-grid mb-2">
                    <button
                      type="button"
                      className={`btn btn-primary fw-bold py-2 rounded-3 shadow-lg ${styles.submitBtn}`}
                    >
                      Đăng Nhập <i className="bi bi-box-arrow-in-right ms-1"></i>
                    </button>
                  </div>

                  {/* Chuyển sang Đăng ký */}
                  <div className="text-center">
                    <span className="small text-light opacity-75">
                      Chưa có tài khoản?
                    </span>
                    <Link
                      href="/register"
                      className="small fw-bold text-info text-decoration-none ms-1"
                    >
                      Đăng ký ngay
                    </Link>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;