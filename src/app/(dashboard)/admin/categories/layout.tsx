import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục",
};

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
