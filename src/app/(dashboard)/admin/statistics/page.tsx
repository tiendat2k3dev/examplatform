"use client";

import { useState } from "react";

interface RankingMember {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

interface NewMember {
  name: string;
  email: string;
  time: string;
  avatar: string;
}

const Statistics = () => {
  const [rankingMembers] = useState<RankingMember[]>([
    {
      rank: 1,
      name: "longvirus",
      score: 220,
      avatar: "L",
    },
    {
      rank: 2,
      name: "laphuc",
      score: 200,
      avatar: "L",
    },
    {
      rank: 3,
      name: "phunhuan",
      score: 180,
      avatar: "P",
    },
    {
      rank: 4,
      name: "vonghia",
      score: 150,
      avatar: "V",
    },
    {
      rank: 5,
      name: "demons",
      score: 100,
      avatar: "D",
    },
  ]);

  const [newMembers] = useState<NewMember[]>([
    {
      name: "kakashi",
      email: "kakashi@gmail.com",
      time: "15/08/2026 09:45",
      avatar: "K",
    },
    {
      name: "naruto",
      email: "naruto@gmail.com",
      time: "15/08/2026 08:30",
      avatar: "N",
    },
    {
      name: "hinata",
      email: "hinata@gmail.com",
      time: "15/08/2026 07:15",
      avatar: "H",
    },
  ]);

  const [statistics] = useState({
    totalMembers: 1250,
    newMembers: 23,
    totalExams: 85,
    totalQuestions: 1520,
  });

  return (
    <div className="container-fluid bg-light min-vh-100 px-4 py-4">
      {/* ===================== STATISTICS CARDS ===================== */}
      <div className="row g-3 mb-3">
        {/* Tổng thành viên */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{
                    width: "52px",
                    height: "52px",
                  }}
                >
                  <i
                    className="bi bi-people-fill"
                    style={{ fontSize: "23px" }}
                  ></i>
                </div>
              </div>

              <div className="mt-2">
                <div className="small text-secondary">Tổng thành viên</div>

                <div className="fs-3 fw-bold text-dark">
                  {statistics.totalMembers.toLocaleString("en-US")}
                </div>

                <div className="small text-success">
                  <i className="bi bi-arrow-up me-1"></i>
                  12 từ hôm qua
                </div>
              </div>

              {/* Mock chart */}
              <div className="mt-2">
                <svg
                  width="100%"
                  height="35"
                  viewBox="0 0 220 35"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 28 C20 20, 25 30, 45 18 S70 8, 90 18 S115 5, 135 15 S160 30, 180 13 S200 25, 220 8"
                    fill="none"
                    stroke="#7c5ce6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Thành viên mới */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                style={{
                  width: "52px",
                  height: "52px",
                }}
              >
                <i
                  className="bi bi-person-plus-fill"
                  style={{ fontSize: "23px" }}
                ></i>
              </div>

              <div className="mt-2">
                <div className="small text-secondary">Thành viên mới</div>

                <div className="fs-3 fw-bold text-dark">
                  {statistics.newMembers}
                </div>

                <div className="small text-success">
                  <i className="bi bi-arrow-up me-1"></i>8 từ hôm qua
                </div>
              </div>

              <div className="mt-2">
                <svg
                  width="100%"
                  height="35"
                  viewBox="0 0 220 35"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 27 C20 26, 30 10, 50 17 S80 30, 100 13 S125 8, 145 20 S175 25, 195 10 S210 20, 220 6"
                    fill="none"
                    stroke="#35a875"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng đề thi */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{
                  width: "52px",
                  height: "52px",
                }}
              >
                <i
                  className="bi bi-file-earmark-text-fill"
                  style={{ fontSize: "23px" }}
                ></i>
              </div>

              <div className="mt-2">
                <div className="small text-secondary">Tổng đề thi</div>

                <div className="fs-3 fw-bold text-dark">
                  {statistics.totalExams}
                </div>

                <div className="small text-success">
                  <i className="bi bi-arrow-up me-1"></i>3 từ hôm qua
                </div>
              </div>

              <div className="mt-2">
                <svg
                  width="100%"
                  height="35"
                  viewBox="0 0 220 35"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 25 C15 18, 30 30, 45 15 S65 8, 85 18 S105 27, 125 12 S150 8, 170 18 S190 30, 205 10 S215 20, 220 12"
                    fill="none"
                    stroke="#4598df"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng câu hỏi */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <div
                className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center"
                style={{
                  width: "52px",
                  height: "52px",
                }}
              >
                <i
                  className="bi bi-question-circle-fill"
                  style={{ fontSize: "23px" }}
                ></i>
              </div>

              <div className="mt-2">
                <div className="small text-secondary">Tổng câu hỏi</div>

                <div className="fs-3 fw-bold text-dark">
                  {statistics.totalQuestions.toLocaleString("en-US")}
                </div>

                <div className="small text-success">
                  <i className="bi bi-arrow-up me-1"></i>
                  24 từ hôm qua
                </div>
              </div>

              <div className="mt-2">
                <svg
                  width="100%"
                  height="35"
                  viewBox="0 0 220 35"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 20 C20 10, 35 12, 50 22 S75 30, 90 15 S115 8, 130 20 S155 28, 175 12 S200 8, 220 10"
                    fill="none"
                    stroke="#e6a23c"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MAIN ===================== */}
      <div className="row g-3">
        {/* ================= BẢNG XẾP HẠNG ================= */}
        <div className="col-12 col-xl-7">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    <i className="bi bi-trophy-fill text-warning me-2"></i>
                    Vinh danh bảng vàng
                  </h5>

                  <p className="text-secondary small mb-0">
                    Top thành viên có số điểm tích lũy cao nhất
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  Xem tất cả
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>

              {/* Ranking */}
              <div className="px-3 pb-3">
                {rankingMembers.map((member) => (
                  <div
                    key={member.rank}
                    className={`d-flex align-items-center justify-content-between px-3 py-3 border-bottom ${
                      member.rank === 1 ? "bg-warning-subtle" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {/* Rank */}
                      <div
                        className="d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "35px",
                          fontSize: member.rank <= 3 ? "22px" : "16px",
                        }}
                      >
                        {member.rank === 1
                          ? "🥇"
                          : member.rank === 2
                            ? "🥈"
                            : member.rank === 3
                              ? "🥉"
                              : member.rank}
                      </div>

                      {/* Avatar */}
                      <div
                        className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        {member.avatar}
                      </div>

                      {/* Name */}
                      <div className="fw-semibold">
                        {member.name}

                        {member.rank === 1 && (
                          <span className="ms-2 text-warning">
                            <i className="bi bi-crown-fill"></i>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div>
                      <span
                        className={`fw-bold ${
                          member.rank === 1 ? "text-warning" : "text-dark"
                        }`}
                        style={{ fontSize: "18px" }}
                      >
                        {member.score}
                      </span>

                      <span className="small text-secondary ms-1">điểm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= THỐNG KÊ THÀNH VIÊN ================= */}
        <div className="col-12 col-xl-5">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              {/* Header */}
              <h5 className="fw-bold mb-3">
                <i className="bi bi-people-fill text-primary me-2"></i>
                Thống kê thành viên
              </h5>

              {/* Tổng thành viên */}
              <div className="d-flex align-items-center justify-content-between bg-primary-subtle rounded p-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <i className="bi bi-people-fill"></i>
                  </div>

                  <div>
                    <div className="fw-semibold small">Tổng thành viên</div>

                    <div className="text-secondary small">
                      Toàn bộ thành viên hệ thống
                    </div>
                  </div>
                </div>

                <span className="fw-bold text-primary fs-5">
                  {statistics.totalMembers.toLocaleString("en-US")}
                </span>
              </div>

              {/* Thành viên mới nhất */}
              <div className="d-flex align-items-center justify-content-between bg-success-subtle rounded p-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <i className="bi bi-person-plus-fill"></i>
                  </div>

                  <div>
                    <div className="fw-semibold small">Thành viên mới nhất</div>

                    <div className="text-secondary small">
                      Đăng ký gần đây nhất
                    </div>
                  </div>
                </div>

                <span className="fw-bold text-success fs-5">
                  {statistics.newMembers}
                </span>
              </div>

              {/* Thành viên mới nhất */}
              <h6 className="fw-bold mb-2">Thành viên mới nhất</h6>

              {newMembers.map((member, index) => (
                <div
                  key={member.email}
                  className={`d-flex align-items-center justify-content-between py-2 ${
                    index !== newMembers.length - 1 ? "border-bottom" : ""
                  }`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "38px",
                        height: "38px",
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

              {/* Xem tất cả */}
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none p-0"
                >
                  Xem tất cả thành viên mới
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
};

export default Statistics;
