"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token nếu bạn đang lưu trong localStorage
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

    // Đóng menu
    setShowProfileMenu(false);

    // Chuyển về trang login
    router.push("/");
  };

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
                  src="/Untitled.png"
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
