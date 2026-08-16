// src/components/Auth/LoginForm.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loginApiAsync } from "@/redux/reducers/AuthReducer";
import { loginSchema } from "@/schemas/loginSchema";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // State quản lý ẩn / hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [currentUser, router]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      dispatch(
        loginApiAsync(values, (user) => {
          if (user.role === "Admin") {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        })
      );
    },
  });

  return (
    <div className="row justify-content-center position-relative z-1 w-100 m-0">
      <div className="col-12 col-lg-10 col-xl-9 px-0">
        <div
          className={`card border border-primary border-opacity-50 shadow-lg rounded-4 text-white overflow-hidden ${styles.loginCard}`}
        >
          <div className="card-body p-3 p-sm-4 p-md-5">
            <div className="row align-items-center g-4">
              {/* CỘT TRÁI */}
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
                  Nhập thông tin tài khoản của bạn để truy cập hệ thống thi trắc
                  nghiệm IT trực tuyến.
                </p>
              </div>

              {/* CỘT PHẢI */}
              <div className="col-lg-7 ps-lg-4">
                <form onSubmit={formik.handleSubmit}>
                  {/* Tên đăng nhập */}
                  <div className="mb-2">
                    <label
                      htmlFor="username"
                      className="form-label small fw-bold text-black opacity-90 mb-1"
                    >
                      Tên đăng nhập <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border ${
                        formik.errors.username
                          ? "border-danger"
                          : "border-secondary"
                      } border-opacity-50 ${styles.inputGroupCustom}`}
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

                  {/* Mật khẩu */}
                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="form-label small fw-bold text-black opacity-90 mb-1"
                    >
                      Mật khẩu <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`input-group overflow-hidden rounded-3 border ${
                        formik.errors.password
                          ? "border-danger"
                          : "border-secondary"
                      } border-opacity-50 ${styles.inputGroupCustom}`}
                    >
                      <span className="input-group-text bg-transparent border-0 text-info py-1">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control bg-transparent border-0 text-white shadow-none fs-6 py-1 ${styles.inputCustom}`}
                        id="password"
                        placeholder="Nhập mật khẩu..."
                        {...formik.getFieldProps("password")}
                      />
                      {/* Nút Toggle ẩn/hiện */}
                      <button
                        type="button"
                        className="btn bg-transparent border-0 text-info px-3 shadow-none"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          }`}
                        ></i>
                      </button>
                    </div>
                    {formik.errors.password && (
                      <div className="text-danger small mt-1">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  {/* Ghi nhớ & Quên mật khẩu */}
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
                      type="submit"
                      className={`btn btn-primary fw-bold py-2 rounded-3 shadow-lg ${styles.submitBtn}`}
                    >
                      Đăng Nhập{" "}
                      <i className="bi bi-box-arrow-in-right ms-1"></i>
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