import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
  description: "Đăng nhập vào ứng dụng",
};
export default function Home({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
