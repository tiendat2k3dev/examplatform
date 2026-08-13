"use client";

import { useEffect } from "react";

export default function ClientScript() {
  useEffect(() => {
    // Đảm bảo Bootstrap JS bundle được load và chạy ở client-side
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}