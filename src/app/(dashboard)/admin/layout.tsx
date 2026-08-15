"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.authReducer);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!currentUser) {
        router.push("/login");
      } else if (currentUser.role !== "Admin") {
        router.push("/user");
      }
    }
  }, [mounted, currentUser, router]);

  if (!mounted || !currentUser || currentUser.role !== "Admin") {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex vh-100 overflow-hidden">
        {/* Sidebar */}
        <div
          className="bg-light border-end flex-shrink-0"
          style={{ width: "200px" }}
        >
          <Sidebar />
        </div>

        {/* Main */}
        <div className="d-flex flex-column flex-grow-1">
          {/* Header */}
          <Header />

          {/* Content */}
          <main className="">{children}</main>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}
