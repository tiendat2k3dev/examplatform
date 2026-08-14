// src/redux/Providers.tsx
"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { initCurrentUser } from "@/redux/reducers/AuthReducer";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Tự động khôi phục dữ liệu user từ localStorage ngay khi Client load xong
    store.dispatch(initCurrentUser());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}