import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý câu hỏi",
};

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
