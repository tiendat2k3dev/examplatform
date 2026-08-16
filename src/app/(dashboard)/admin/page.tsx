import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

const AdminPage = () => {
  const stats = [
    {
      icon: "bi-people-fill",
      title: "Tổng thành viên",
      value: "1,250",
      change: "+24",
      text: "so với tháng trước",
      color: "primary",
    },
    {
      icon: "bi-file-earmark-text-fill",
      title: "Tổng đề thi",
      value: "85",
      change: "+5",
      text: "so với tháng trước",
      color: "success",
    },
    {
      icon: "bi-question-circle-fill",
      title: "Tổng câu hỏi",
      value: "3,240",
      change: "+120",
      text: "so với tháng trước",
      color: "info",
    },
    {
      icon: "bi-graph-up-arrow",
      title: "Lượt thi hôm nay",
      value: "342",
      change: "+30",
      text: "so với hôm qua",
      color: "warning",
    },
  ];

  const recentMembers = [
    {
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      time: "15/05/2026 09:45",
      avatar: "N",
    },
    {
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      time: "15/05/2026 08:30",
      avatar: "T",
    },
    {
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      time: "15/05/2026 07:15",
      avatar: "L",
    },
    {
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      time: "14/05/2026 21:40",
      avatar: "P",
    },
    {
      name: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      time: "14/05/2026 20:10",
      avatar: "H",
    },
  ];

  const recentExams = [
    {
      code: "EX001",
      name: "Java Core cơ bản",
      category: "Java Backend",
      duration: "60 phút",
      status: "Hoạt động",
    },
    {
      code: "EX002",
      name: "Spring Boot RESTful API",
      category: "Java Backend",
      duration: "45 phút",
      status: "Hoạt động",
    },
    {
      code: "EX003",
      name: "HTML, CSS & Responsive",
      category: "Frontend Web",
      duration: "30 phút",
      status: "Hoạt động",
    },
    {
      code: "EX004",
      name: "SQL Query nâng cao",
      category: "Cơ Sở Dữ Liệu",
      duration: "40 phút",
      status: "Khóa",
    },
  ];

  const topMembers = [
    {
      rank: 1,
      name: "Nguyễn Văn A",
      score: 950,
    },
    {
      rank: 2,
      name: "Trần Thị B",
      score: 900,
    },
    {
      rank: 3,
      name: "Lê Văn C",
      score: 850,
    },
    {
      rank: 4,
      name: "Phạm Thị D",
      score: 800,
    },
    {
      rank: 5,
      name: "Hoàng Văn E",
      score: 780,
    },
  ];

  return (
    <div className="container-fluid bg-light min-vh-100 p-3">
      {/* ================= HEADER ================= */}
      <div className="card border-0 shadow-sm mb-3 overflow-hidden">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-dark mb-2">
                Chào mừng trở lại, Admin! 👋
              </h4>

              <p className="text-secondary small mb-0">
                Quản lý và theo dõi hệ thống trắc nghiệm của bạn.
              </p>
            </div>

            <div className="d-none d-md-flex align-items-center">
              <div
                className="bg-primary-subtle rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  width: "130px",
                  height: "70px",
                }}
              >
                <i
                  className="bi bi-bar-chart-line-fill text-primary"
                  style={{ fontSize: "40px" }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="row g-3 mb-3">
        {stats.map((stat) => (
          <div key={stat.title} className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`bg-${stat.color}-subtle text-${stat.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{
                      width: "48px",
                      height: "48px",
                      minWidth: "48px",
                    }}
                  >
                    <i
                      className={`bi ${stat.icon}`}
                      style={{ fontSize: "21px" }}
                    ></i>
                  </div>

                  <div>
                    <div className="text-secondary small">{stat.title}</div>

                    <div className="fw-bold fs-4 text-dark">{stat.value}</div>

                    <div className="small">
                      <span className="text-success fw-semibold">
                        {stat.change}
                      </span>{" "}
                      <span className="text-secondary">{stat.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= CHART + MEMBERS ================= */}
      <div className="row g-3 mb-3">
        {/* Chart */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Thống kê lượt thi trong 7 ngày qua
                </h6>

                <select className="form-select form-select-sm w-auto">
                  <option>7 ngày qua</option>
                  <option>30 ngày qua</option>
                  <option>3 tháng qua</option>
                </select>
              </div>

              {/* Mock chart */}
              <div className="position-relative" style={{ height: "240px" }}>
                <div className="position-absolute top-0 bottom-0 start-0 d-flex flex-column justify-content-between text-secondary small">
                  <span>500</span>
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>

                <div
                  className="position-absolute"
                  style={{
                    left: "38px",
                    right: "10px",
                    top: "5px",
                    bottom: "25px",
                  }}
                >
                  {[500, 400, 300, 200, 100, 0].map((value) => (
                    <div
                      key={value}
                      className="border-top"
                      style={{
                        position: "absolute",
                        width: "100%",
                        top: `${100 - (value / 500) * 100}%`,
                      }}
                    ></div>
                  ))}

                  <div className="h-100 d-flex align-items-end gap-2">
                    {[120, 180, 260, 310, 280, 320, 342].map((value, index) => (
                      <div
                        key={index}
                        className="flex-fill position-relative d-flex align-items-end justify-content-center"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="bg-primary-subtle w-100 rounded-top"
                          style={{
                            height: `${(value / 500) * 100}%`,
                          }}
                        ></div>

                        <span
                          className="position-absolute text-primary fw-semibold small"
                          style={{
                            bottom: `${(value / 500) * 100 + 3}%`,
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="position-absolute d-flex justify-content-between text-secondary small"
                  style={{
                    left: "38px",
                    right: "10px",
                    bottom: "0",
                  }}
                >
                  <span>09/05</span>
                  <span>10/05</span>
                  <span>11/05</span>
                  <span>12/05</span>
                  <span>13/05</span>
                  <span>14/05</span>
                  <span>15/05</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent members */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Thành viên mới nhất</h6>

                <a
                  href="/admin/members"
                  className="text-primary small text-decoration-none"
                >
                  Xem tất cả
                </a>
              </div>

              {recentMembers.map((member) => (
                <div
                  key={member.email}
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      {member.avatar}
                    </div>

                    <div>
                      <div className="fw-semibold small">{member.name}</div>

                      <div className="text-secondary small">{member.email}</div>
                    </div>
                  </div>

                  <small className="text-secondary">{member.time}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= EXAMS + RANKING ================= */}
      <div className="row g-3">
        {/* Recent exams */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3">
                <h6 className="fw-bold mb-0">Đề thi được tạo gần đây</h6>

                <a
                  href="/admin/exams"
                  className="text-primary small text-decoration-none"
                >
                  Xem tất cả
                </a>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary">Mã đề thi</th>
                      <th className="small text-secondary">Tên đề thi</th>
                      <th className="small text-secondary">Danh mục</th>
                      <th className="small text-secondary">Thời gian</th>
                      <th className="small text-secondary">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentExams.map((exam) => (
                      <tr key={exam.code}>
                        <td className="small fw-semibold">{exam.code}</td>

                        <td className="small">{exam.name}</td>

                        <td className="small text-secondary">
                          {exam.category}
                        </td>

                        <td className="small">{exam.duration}</td>

                        <td>
                          <span
                            className={`badge rounded-pill fw-normal ${
                              exam.status === "Hoạt động"
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            }`}
                          >
                            {exam.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3">
                <h6 className="fw-bold mb-0">Top thành viên có điểm cao</h6>

                <a
                  href="/admin/ranking"
                  className="text-primary small text-decoration-none"
                >
                  Xem tất cả
                </a>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary">Hạng</th>
                      <th className="small text-secondary">Thành viên</th>
                      <th className="small text-secondary text-end">
                        Tổng điểm
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {topMembers.map((member) => (
                      <tr key={member.rank}>
                        <td>
                          {member.rank <= 3 ? (
                            <span style={{ fontSize: "18px" }}>
                              {member.rank === 1
                                ? "🥇"
                                : member.rank === 2
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          ) : (
                            <span className="small fw-semibold">
                              {member.rank}
                            </span>
                          )}
                        </td>

                        <td className="small">{member.name}</td>

                        <td className="text-end small fw-semibold">
                          {member.score} điểm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-secondary small py-3">
        © 2026 Online Quiz. All rights reserved.
      </div>
    </div>
  );
};

export default AdminPage;
