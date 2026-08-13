import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking",
};

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
