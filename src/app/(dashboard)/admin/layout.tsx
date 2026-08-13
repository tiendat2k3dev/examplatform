import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex vh-100 overflow-hidden">
        {/* Sidebar */}
        <div
          className="bg-light border-end flex-shrink-0"
          style={{ width: "200px" }}
        >
          <Sidebar />
        </div>

        {/* Main */}
        <div className="d-flex flex-column flex-grow-1">
          {/* Header */}
          <Header />

          {/* Content */}
          <main className="">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
