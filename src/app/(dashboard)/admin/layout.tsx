import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
};

export default function Admin({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
