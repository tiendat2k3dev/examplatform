import styles from "./SupportSection.module.css";

const SupportSection = () => {
  return (
    <section className="mb-5">
      <div
        className={`p-4 p-md-5 rounded-4 text-white shadow-lg position-relative overflow-hidden border border-info border-opacity-25 ${styles.supportSection}`}
      >
        <div
          className={`position-absolute rounded-circle opacity-30 ${styles.glowCircle}`}
        ></div>

        <div className="row align-items-center position-relative z-1 g-4">
          {/* Cột trái: Giới thiệu */}
          <div className="col-lg-6">
            <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold mb-3">
              <i className="bi bi-headset me-1"></i> Admin Support 24/7
            </span>
            <h2 className="fw-bold display-6 mb-3 text-white">
              Hỗ Trợ Trực Tuyến
            </h2>
            <p className="text-light opacity-75 mb-4 fs-6">
              Bạn gặp sự cố khi làm bài thi, cần cấp lại tài khoản hoặc giải đáp
              thắc mắc về hệ thống? Đội ngũ Administrator luôn sẵn sàng hỗ trợ
              bạn.
            </p>
            <div className="d-flex align-items-center gap-2 text-info">
              <i className="bi bi-clock-history fs-4"></i>
              <div>
                <div className="fw-bold small text-white">
                  Thời gian làm việc
                </div>
                <small className="text-light opacity-75">
                  08:00 - 22:00 (T2 - CN)
                </small>
              </div>
            </div>
          </div>

          {/* Cột phải: Các thẻ liên hệ */}
          <div className="col-lg-6">
            <div className="row row-cols-1 row-cols-sm-2 g-3">
              {/* Hotline Admin */}
              <div className="col">
                <div
                  className={`p-3 rounded-3 border border-light border-opacity-10 h-100 ${styles.contactCard}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 px-3 rounded-circle bg-success text-white flex-shrink-0 shadow-sm">
                      <i className="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div className="overflow-hidden">
                      <small className="text-light opacity-75 d-block text-truncate">
                        Hotline Trực Tuyến
                      </small>
                      <strong className="text-white small fw-bold text-break">
                        0905.XXX.XXX
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Support */}
              <div className="col">
                <div
                  className={`p-3 rounded-3 border border-light border-opacity-10 h-100 ${styles.contactCard}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 px-3 rounded-circle bg-danger text-white flex-shrink-0 shadow-sm">
                      <i className="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div className="overflow-hidden">
                      <small className="text-light opacity-75 d-block text-truncate">
                        Email Báo Lỗi
                      </small>
                      <strong className="text-white small fw-bold text-break">
                        admin@rms.edu.vn
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Chat / Zalo */}
              <div className="col">
                <div
                  className={`p-3 rounded-3 border border-light border-opacity-10 h-100 ${styles.contactCard}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 px-3 rounded-circle bg-primary text-white flex-shrink-0 shadow-sm">
                      <i className="bi bi-chat-dots-fill fs-5"></i>
                    </div>
                    <div className="overflow-hidden">
                      <small className="text-light opacity-75 d-block text-truncate">
                        Zalo / Telegram
                      </small>
                      <strong className="text-white small fw-bold text-break">
                        @RMS_Support
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discord Community */}
              <div className="col">
                <div
                  className={`p-3 rounded-3 border border-light border-opacity-10 h-100 ${styles.contactCard}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 px-3 rounded-circle bg-warning text-dark flex-shrink-0 shadow-sm">
                      <i className="bi bi-discord fs-5"></i>
                    </div>
                    <div className="overflow-hidden">
                      <small className="text-light opacity-75 d-block text-truncate">
                        Cộng Đồng Coder
                      </small>
                      <strong className="text-white small fw-bold text-break">
                        discord.gg/rms
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
