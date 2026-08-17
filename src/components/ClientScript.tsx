"use client";

import { useEffect } from "react";

/**
 * ClientScript - Nhúng Bootstrap JS bundle ở phía client
 * Đảm bảo các component Bootstrap (modal, dropdown, tooltip...) hoạt động
 */
export default function ClientScript() {
  useEffect(() => {
    // Đảm bảo Bootstrap JS bundle được load và chạy ở client-side
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}