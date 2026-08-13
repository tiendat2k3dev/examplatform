import styles from "./ExamSubjects.module.css";

const ExamSubjects = () => {
  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 fw-bold border border-primary border-opacity-25">
            <i className="bi bi-code-slash me-1"></i> Ngân Hàng Đề Thi
          </span>
          <h2 className="fw-bold m-0 text-dark">Các Môn Thi Lập Trình</h2>
        </div>
        <a
          href="#"
          className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
        >
          Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
        </a>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Card 1: Java */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-danger bg-opacity-10 text-danger">
                  <i className="bi bi-cup-hot-fill fs-2"></i>
                </div>
                <span className="badge bg-danger text-white px-3 py-2 rounded-pill fs-6 shadow-sm">
                  12 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">Java Backend</h4>
              <p className="text-secondary small mb-4">
                Java Core, OOP, Spring Boot, Collection Framework &amp;
                Multithreading.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-danger fw-bold rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: C# & .NET */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <i className="bi bi-windows fs-2"></i>
                </div>
                <span className="badge bg-primary text-white px-3 py-2 rounded-pill fs-6 shadow-sm">
                  10 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">C# &amp; .NET</h4>
              <p className="text-secondary small mb-4">
                C# Basic, .NET Core Web API, Entity Framework, LINQ &amp; MVC
                Architecture.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-primary fw-bold rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Frontend Web */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-warning bg-opacity-10 text-warning">
                  <i className="bi bi-filetype-html fs-2"></i>
                </div>
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 fw-bold shadow-sm">
                  15 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">Frontend Web</h4>
              <p className="text-secondary small mb-4">
                HTML5, CSS3, JavaScript ES6+, Bootstrap 5 &amp; ReactJS căn bản.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-warning fw-bold text-dark rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Cơ Sở Dữ Liệu SQL */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success">
                  <i className="bi bi-database-fill fs-2"></i>
                </div>
                <span className="badge bg-success text-white px-3 py-2 rounded-pill fs-6 shadow-sm">
                  8 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">Cơ Sở Dữ Liệu</h4>
              <p className="text-secondary small mb-4">
                SQL Server, MySQL, các câu lệnh truy vấn Join, Group By,
                Subquery &amp; Index.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-success fw-bold rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: C / C++ Base */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-info bg-opacity-10 text-info">
                  <i className="bi bi-cpu-fill fs-2"></i>
                </div>
                <span className="badge bg-info text-dark px-3 py-2 rounded-pill fs-6 fw-bold shadow-sm">
                  6 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">C / C++ Base</h4>
              <p className="text-secondary small mb-4">
                Cấu trúc dữ liệu &amp; Giải thuật, Con trỏ, Mảng, Struct &amp;
                Quản lý bộ nhớ.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-info fw-bold text-dark rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Python */}
        <div className="col">
          <div
            className={`card h-100 rounded-4 bg-white border-0 shadow-sm ${styles.hoverCard}`}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="p-3 rounded-3 bg-secondary bg-opacity-10 text-secondary">
                  <i className="bi bi-filetype-py fs-2"></i>
                </div>
                <span className="badge bg-secondary text-white px-3 py-2 rounded-pill fs-6 shadow-sm">
                  5 Đề thi
                </span>
              </div>
              <h4 className="fw-bold mb-2 text-dark">Python Lập Trình</h4>
              <p className="text-secondary small mb-4">
                Cú pháp cơ bản, String/List/Dict, Function, Module &amp; Xử lý
                File trong Python.
              </p>
              <div className="d-grid mt-auto">
                <button
                  type="button"
                  className="btn btn-outline-secondary fw-bold rounded-3 py-2"
                >
                  Vào Thi Ngay <i className="bi bi-box-arrow-in-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamSubjects;
