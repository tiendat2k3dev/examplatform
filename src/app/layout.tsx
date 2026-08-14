import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar"; // 1. Import Sidebar
import ClientScript from "@/components/ClientScript";
import { Providers } from "@/redux/Providers";
import { ToastContainer } from "react-toastify"; // Import ToastContainer

export const metadata: Metadata = {
  title: "CodeGym Exam IT",
  description: "Hệ thống thi trắc nghiệm IT trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Bổ sung suppressHydrationWarning vào body */}
      <body className="d-flex flex-column vh-100 overflow-hidden" suppressHydrationWarning>
        <Providers>
          {/* Header trên cùng */}
          <Navbar />

          {/* Khung chứa Sidebar (bên trái) và Nội dung chính + Footer (bên phải) */}
          <div className="d-flex flex-grow-1 overflow-hidden position-relative">
            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* Vùng nội dung cuộn bên phải */}
            <div className="flex-grow-1 d-flex flex-column overflow-y-auto">
              <main className="flex-grow-1">{children}</main>
              <Footer />
            </div>
          </div>

          <ClientScript />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Providers>
      </body>
    </html>
  );
}