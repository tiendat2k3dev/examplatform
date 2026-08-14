"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/reducers/AuthReducer";

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const handleLogout = () => {
    setShowProfileMenu(false);
    dispatch(logout());
    router.push("/");
  };

  const avatarSrc =
    currentUser?.avatarUrl && currentUser.avatarUrl.trim() !== ""
      ? currentUser.avatarUrl
      : "/Untitled.png";
  const displayName = currentUser?.fullName || currentUser?.username || "User";

  return (
    <header className="bg-white border-bottom">
      <div className="container-fluid px-4">
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ height: "64px" }}
        >
          {/* Khoảng trống thay cho Search */}
          <div style={{ width: "300px" }}></div>

          {/* Right */}
          <div className="d-flex align-items-center gap-4">
            {/* Notification */}
            <button
              type="button"
              className="btn btn-link text-dark p-0 position-relative"
            >
              <i className="bi bi-bell fs-5"></i>

              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
            </button>

            {/* Help */}
            <button type="button" className="btn btn-link text-dark p-0">
              <i className="bi bi-question-circle fs-5"></i>
            </button>

            {/* Divider */}
            <div className="border-start" style={{ height: "30px" }}></div>

            {/* Avatar + Dropdown */}
            <div className="position-relative">
              <button
                type="button"
                className="btn p-0 border-0"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Image
                  src={avatarSrc}
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-circle border"
                  style={{ objectFit: "cover" }}
                />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div
                  className="position-absolute bg-white border rounded-3 shadow-sm"
                  style={{
                    top: "45px",
                    right: 0,
                    width: "180px",
                    zIndex: 1000,
                  }}
                >
                  {/* Thông tin user */}
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-semibold text-dark small text-truncate">
                      {displayName}
                    </div>
                    <div
                      className="text-muted small text-truncate"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {currentUser?.email}
                    </div>
                  </div>

                  {/* Cập nhật thông tin */}
                  <button
                    type="button"
                    className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 border-0 rounded-0"
                  >
                    <i className="bi bi-person"></i>
                    <span>Cập nhật thông tin</span>
                  </button>

                  {/* Đổi mật khẩu */}
                  <button
                    type="button"
                    className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 border-0 border-top rounded-0"
                  >
                    <i className="bi bi-key"></i>
                    <span>Đổi mật khẩu</span>
                  </button>

                  {/* Đăng xuất */}
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
  );
};

export default Header;
