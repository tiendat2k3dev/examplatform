import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thong tin nguoi dung",
  description: "Admin",
};

export default function Admin({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
