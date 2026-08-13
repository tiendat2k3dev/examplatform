import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thong tin nguoi dung",
  description: "User",
};

export default function User({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
