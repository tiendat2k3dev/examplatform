"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerApiAsync } from "@/redux/reducers/AuthReducer";
import { registerSchema } from "@/schemas/registerSchema";
import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      agreeTerms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const { confirmPassword, agreeTerms, ...userData } = values;

      dispatch(
        registerApiAsync(userData, () => {
          alert("Đăng ký thành công!");
          router.push("/login");
        }),
      );
    },
  });

  return (
    <div className="row justify-content-center position-relative z-1 w-100 m-0">
      <div className="col-12 col-lg-10 col-xl-9 px-0">
        <div
          className={`card shadow-lg rounded-4 text-white overflow-hidden ${styles.registerCard}`}
        >
          <div className="card-body p-3 p-sm-4 p-md-4">
            <div className="row align-items-center g-4">
              {/* CỘT TRÁI */}
              <div className="col-lg-4 text-center text-lg-start border-end-lg border-secondary border-opacity-25 pe-lg-4">
                <div
                  className={`d-inline-flex p-3 rounded-circle text-info border border-info border-opacity-50 mb-3 shadow-sm ${styles.iconHeaderBox}`}
                >
                  <i className="bi bi-person-plus-fill fs-2"></i>
                </div>
                <h3 className={`fw-bold mb-2 ${styles.titleGradient}`}>
                  Tạo Tài Khoản
                </h3>
                <p className="text-light opacity-75 small mb-0">
                  Đăng ký thành viên để tham gia hệ thống thi trắc nghiệm IT
                  trực tuyến.
                </p>
              </div>

              {/* CỘT PHẢI */}
              <div className="col-lg-8 ps-lg-4">
                <form onSubmit={formik.handleSubmit}>
                  {/* Tên đăng nhập */}
                  <div className="mb-2">
                    <label
                      htmlFor="username"
                      className="form-label small fw-bold text-light opacity-90 mb-1"
                    >
                      Tên đăng nhập <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border ${formik.errors.username ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info py-1">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                        id="username"
                        placeholder="Nhập username..."
                        {...formik.getFieldProps("username")}
                      />
                    </div>
                    {formik.errors.username && (
                      <div className="text-danger small mt-1">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>

                  {/* Mật khẩu & Xác nhận */}
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label
                        htmlFor="password"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.password ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="password"
                          placeholder="Mật khẩu..."
                          {...formik.getFieldProps("password")}
                        />
                      </div>
                      {formik.errors.password && (
                        <div className="text-danger small mt-1">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Xác nhận <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.confirmPassword ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-shield-check"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="confirmPassword"
                          placeholder="Nhập lại M/K..."
                          {...formik.getFieldProps("confirmPassword")}
                        />
                      </div>
                      {formik.errors.confirmPassword && (
                        <div className="text-danger small mt-1">
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Họ và tên & Email */}
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label
                        htmlFor="fullName"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Họ và tên <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.fullName ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-card-heading"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="fullName"
                          placeholder="Họ và tên..."
                          {...formik.getFieldProps("fullName")}
                        />
                      </div>
                      {formik.errors.fullName && (
                        <div className="text-danger small mt-1">
                          {formik.errors.fullName}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="email"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Email <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.email ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="email"
                          placeholder="Email..."
                          {...formik.getFieldProps("email")}
                        />
                      </div>
                      {formik.errors.email && (
                        <div className="text-danger small mt-1">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Số điện thoại & Địa chỉ */}
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="phone"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Số điện thoại <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.phone ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-telephone"></i>
                        </span>
                        <input
                          type="tel"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="phone"
                          placeholder="Số điện thoại..."
                          {...formik.getFieldProps("phone")}
                        />
                      </div>
                      {formik.errors.phone && (
                        <div className="text-danger small mt-1">
                          {formik.errors.phone}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="address"
                        className="form-label small fw-bold text-light opacity-90 mb-1"
                      >
                        Địa chỉ <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`input-group overflow-hidden rounded-3 border ${formik.errors.address ? "border-danger" : "border-secondary"} border-opacity-50 ${styles.inputGroupCustom}`}
                      >
                        <span className="input-group-text bg-transparent border-0 text-info py-1">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                          id="address"
                          placeholder="Địa chỉ..."
                          {...formik.getFieldProps("address")}
                        />
                      </div>
                      {formik.errors.address && (
                        <div className="text-danger small mt-1">
                          {formik.errors.address}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Điều khoản */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input bg-dark border-secondary"
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formik.values.agreeTerms}
                      onChange={formik.handleChange}
                    />
                    <label
                      className="form-check-label small text-light opacity-75"
                      htmlFor="agreeTerms"
                    >
                      Tôi đồng ý với{" "}
                      <a href="#" className="text-info text-decoration-none">
                        Điều khoản dịch vụ
                      </a>
                    </label>
                    {formik.errors.agreeTerms && (
                      <div className="text-danger small mt-1">
                        {formik.errors.agreeTerms}
                      </div>
                    )}
                  </div>

                  {/* Nút Submit */}
                  <div className="d-grid mb-2">
                    <button
                      type="submit"
                      className={`btn btn-primary fw-bold py-2 rounded-3 shadow-lg ${styles.submitBtn}`}
                    >
                      Đăng Ký Thành Viên{" "}
                      <i className="bi bi-person-check-fill ms-1"></i>
                    </button>
                  </div>

                  {/* Chuyển sang Đăng nhập */}
                  <div className="text-center">
                    <span className="small text-light opacity-75">
                      Đã có tài khoản?
                    </span>
                    <Link
                      href="/login"
                      className="small fw-bold text-info text-decoration-none ms-1"
                    >
                      Đăng nhập ngay
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

export default RegisterForm;
