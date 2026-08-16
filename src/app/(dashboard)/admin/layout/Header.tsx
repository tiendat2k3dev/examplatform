"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";

import {
  logout,
  updateUserApiAsync,
  changePasswordApiAsync,
} from "@/redux/reducers/AuthReducer";

import UpdateProfile from "@/components/modal/admin/UpdateProfile";
import ChangePassword from "@/components/modal/admin/ChangePassword";

import type { UpdateUserPayload, ChangePasswordPayload } from "@/types/user";

const Header = () => {
  // ==============================
  // STATE
  // ==============================

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // ==============================
  // ROUTER + REDUX
  // ==============================

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  // ==============================
  // ĐĂNG XUẤT
  // ==============================

  const handleLogout = () => {
    setShowProfileMenu(false);

    dispatch(logout());

    router.push("/");
  };

  // ==============================
  // MỞ MODAL CẬP NHẬT THÔNG TIN
  // ==============================

  const handleOpenUpdateProfile = () => {
    setShowProfileMenu(false);
    setShowUpdateProfile(true);
  };

  // ==============================
  // ĐÓNG MODAL CẬP NHẬT THÔNG TIN
  // ==============================

  const handleCloseUpdateProfile = () => {
    setShowUpdateProfile(false);
  };

  // ==============================
  // MỞ MODAL ĐỔI MẬT KHẨU
  // ==============================

  const handleOpenChangePassword = () => {
    setShowProfileMenu(false);
    setShowChangePassword(true);
  };

  // ==============================
  // ĐÓNG MODAL ĐỔI MẬT KHẨU
  // ==============================

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };

  // ==============================
  // CẬP NHẬT THÔNG TIN
  // ==============================

  const handleUpdateProfile = async (
    values: UpdateUserPayload,
  ): Promise<void> => {
    if (!currentUser) {
      return;
    }

    try {
      await dispatch(
        updateUserApiAsync(currentUser.id, {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
        }),
      );

      setShowUpdateProfile(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  // ==============================
  // ĐỔI MẬT KHẨU
  // ==============================

  const handleChangePassword = async (
    values: ChangePasswordPayload,
  ): Promise<void> => {
    if (!currentUser) {
      return;
    }

    try {
      await dispatch(changePasswordApiAsync(currentUser.id, values));

      // Đóng modal khi đổi mật khẩu thành công
      setShowChangePassword(false);
    } catch (error) {
      console.error("Change password error:", error);
    }
  };

  // ==============================
  // TÊN HIỂN THỊ
  // ==============================

  const displayName = currentUser?.fullName || currentUser?.username || "User";

  // ==============================
  // RENDER
  // ==============================

  return (
    <>
      <header className="bg-white border-bottom">
        <div className="container-fluid px-4">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              height: "64px",
            }}
          >
            {/* =====================================
                LEFT
            ====================================== */}

            <div
              style={{
                width: "300px",
              }}
            />

            {/* =====================================
                RIGHT
            ====================================== */}

            <div className="d-flex align-items-center gap-4">
              {/* =====================================
                  NOTIFICATION
              ====================================== */}

              <button
                type="button"
                className="btn btn-link text-dark p-0 position-relative"
              >
                <i className="bi bi-bell fs-5"></i>

                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" />
              </button>

              {/* =====================================
                  HELP
              ====================================== */}

              <button type="button" className="btn btn-link text-dark p-0">
                <i className="bi bi-question-circle fs-5"></i>
              </button>

              {/* =====================================
                  DIVIDER
              ====================================== */}

              <div
                className="border-start"
                style={{
                  height: "30px",
                }}
              />

              {/* =====================================
                  USER
              ====================================== */}

              <div className="position-relative">
                <button
                  type="button"
                  className="btn p-0 border-0 d-flex align-items-center gap-2"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                >
                  {/* FULL NAME */}

                  <span className="fw-medium text-dark">{displayName}</span>

                  {/* USER ICON */}

                  <i className="bi bi-person-circle fs-3 text-secondary"></i>
                </button>

                {/* =====================================
                    DROPDOWN
                ====================================== */}

                {showProfileMenu && (
                  <div
                    className="position-absolute bg-white border rounded-3 shadow-sm"
                    style={{
                      top: "45px",
                      right: 0,
                      width: "220px",
                      zIndex: 1000,
                    }}
                  >
                    {/* =================================
                        USER INFO
                    ================================== */}

                    <div className="px-3 py-3 border-bottom">
                      <div className="overflow-hidden">
                        <div className="fw-semibold text-dark text-truncate">
                          {displayName}
                        </div>

                        <div
                          className="text-muted text-truncate"
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          {currentUser?.email || ""}
                        </div>
                      </div>
                    </div>

                    {/* =================================
                        CẬP NHẬT THÔNG TIN
                    ================================== */}

                    <button
                      type="button"
                      className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 border-0 rounded-0"
                      onClick={handleOpenUpdateProfile}
                    >
                      <i className="bi bi-person"></i>

                      <span>Cập nhật thông tin</span>
                    </button>

                    {/* =================================
                        ĐỔI MẬT KHẨU
                    ================================== */}

                    <button
                      type="button"
                      className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 border-0 border-top rounded-0"
                      onClick={handleOpenChangePassword}
                    >
                      <i className="bi bi-key"></i>

                      <span>Đổi mật khẩu</span>
                    </button>

                    {/* =================================
                        ĐĂNG XUẤT
                    ================================== */}

                    <button
                      type="button"
                      className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 border-0 border-top rounded-0 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i>

                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          MODAL CẬP NHẬT THÔNG TIN
      ================================================== */}

      {currentUser && (
        <UpdateProfile
          show={showUpdateProfile}
          user={currentUser}
          onClose={handleCloseUpdateProfile}
          onSubmit={handleUpdateProfile}
        />
      )}

      {/* =================================================
          MODAL ĐỔI MẬT KHẨU
      ================================================== */}

      {currentUser && (
        <ChangePassword
          show={showChangePassword}
          onClose={handleCloseChangePassword}
          onSubmit={handleChangePassword}
        />
      )}
    </>
  );
};

export default Header;
