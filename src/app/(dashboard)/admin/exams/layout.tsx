import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý đề thi",
};

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
