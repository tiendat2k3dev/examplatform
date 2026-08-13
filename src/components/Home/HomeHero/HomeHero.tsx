import styles from "./HomeHero.module.css";

const HomeHero = () => {
  return (
    <section
      className={`p-4 p-md-5 mb-5 rounded-4 text-white shadow-lg position-relative overflow-hidden border border-primary border-opacity-25 ${styles.heroSection}`}
    >
      {/* Vòng tròn phát sáng trang trí nền */}
      <div
        className={`position-absolute rounded-circle opacity-50 ${styles.glowCircle1}`}
      ></div>
      <div
        className={`position-absolute rounded-circle opacity-50 ${styles.glowCircle2}`}
      ></div>

      {/* Icon mờ góc phải */}
      <div className="position-absolute top-50 end-0 translate-middle-y me-4 opacity-10 d-none d-lg-block pointer-events-none">
        <i className={`bi bi-code-slash text-info ${styles.bgIcon}`}></i>
      </div>

      <div className="row align-items-center position-relative z-1">
        <div className="col-lg-8">
          <h1 className={`fw-bold display-5 mb-2 ${styles.titleGradient}`}>
            Hệ thống Trắc Nghiệm IT
          </h1>

          <p className="text-light opacity-75 mb-4 fs-5 fw-light">
            Ôn luyện kiến thức Lập trình &amp; Cơ sở dữ liệu trực tuyến.
          </p>

          {/* Ô tìm kiếm */}
          <div
            className={`input-group input-group-lg shadow-lg rounded-3 overflow-hidden p-1 bg-white bg-opacity-10 border border-info border-opacity-25 ${styles.searchBox}`}
          >
            <input
              type="text"
              className={`form-control bg-transparent border-0 text-white fs-6 ps-3 shadow-none ${styles.heroInput}`}
              placeholder="Nhập tên môn học (vd: Java, C#, SQL...)"
              aria-label="Tìm kiếm"
            />
            <button
              className={`btn btn-primary px-4 fw-bold rounded-2 border-0 d-flex align-items-center gap-2 ${styles.searchBtn}`}
              type="button"
            >
              <i className="bi bi-search"></i> Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
