"use client";

import { useState } from "react";

interface RankingMember {
  rank: number;
  name: string;
  email: string;
  score: number;
  exams: number;
  avatar: string;
}

interface NewMember {
  name: string;
  email: string;
  time: string;
  avatar: string;
}

const Ranking = () => {
  const [rankingMembers] = useState<RankingMember[]>([
    {
      rank: 1,
      name: "longvirus",
      email: "longvirus@gmail.com",
      score: 220,
      exams: 12,
      avatar: "L",
    },
    {
      rank: 2,
      name: "laphuc",
      email: "laphuc@gmail.com",
      score: 200,
      exams: 11,
      avatar: "L",
    },
    {
      rank: 3,
      name: "phunhuan",
      email: "phunhuan@gmail.com",
      score: 180,
      exams: 10,
      avatar: "P",
    },
    {
      rank: 4,
      name: "vonghia",
      email: "vonghia@gmail.com",
      score: 150,
      exams: 8,
      avatar: "V",
    },
    {
      rank: 5,
      name: "demons",
      email: "demons@gmail.com",
      score: 100,
      exams: 6,
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
    {
      name: "sakura",
      email: "sakura@gmail.com",
      time: "14/08/2026 21:40",
      avatar: "S",
    },
    {
      name: "sasuke",
      email: "sasuke@gmail.com",
      time: "14/08/2026 20:10",
      avatar: "S",
    },
  ]);

  const [lastUpdated, setLastUpdated] = useState("15/08/2026 10:30");

  const handleRefresh = () => {
    setLastUpdated(
      new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-4 py-4">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-2">BẢNG XẾP HẠNG (RANKING)</h2>

          <p className="text-secondary mb-0 small">
            Vinh danh các thành viên có số điểm tích lũy cao nhất.
          </p>
        </div>

        <div className="text-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-2"
            onClick={handleRefresh}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Cập nhật
          </button>

          <div className="small text-secondary">
            Cập nhật lúc: {lastUpdated}
          </div>
        </div>
      </div>

      {/* ================= STATISTICS ================= */}
      <div className="row g-3 mb-3">
        {/* Tổng thành viên */}
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{
                  width: "58px",
                  height: "58px",
                  minWidth: "58px",
                }}
              >
                <i
                  className="bi bi-people-fill"
                  style={{ fontSize: "25px" }}
                ></i>
              </div>

              <div>
                <div className="text-secondary small">Tổng thành viên</div>

                <div className="fw-bold fs-4">
                  1.250{" "}
                  <span className="fw-normal fs-6 text-secondary">
                    thành viên
                  </span>
                </div>

                <small className="text-secondary">
                  Cập nhật liên tục từ cơ sở dữ liệu
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Thành viên mới nhất */}
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                style={{
                  width: "58px",
                  height: "58px",
                  minWidth: "58px",
                }}
              >
                <i
                  className="bi bi-person-plus-fill"
                  style={{ fontSize: "25px" }}
                ></i>
              </div>

              <div>
                <div className="text-secondary small">Thành viên mới nhất</div>

                <div className="fw-bold fs-5">kakashi</div>

                <small className="text-secondary">15/08/2026 09:45</small>
              </div>
            </div>
          </div>
        </div>

        {/* Top 1 */}
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center"
                style={{
                  width: "58px",
                  height: "58px",
                  minWidth: "58px",
                }}
              >
                <i
                  className="bi bi-trophy-fill"
                  style={{ fontSize: "25px" }}
                ></i>
              </div>

              <div>
                <div className="text-secondary small">Top 1 hiện tại</div>

                <div className="fw-bold fs-5">{rankingMembers[0].name}</div>

                <div className="fw-semibold">
                  {rankingMembers[0].score} điểm
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="row g-3">
        {/* ================= RANKING TABLE ================= */}
        <div className="col-12 col-xl-7">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              {/* Title */}
              <div className="p-3 border-bottom">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-trophy-fill text-warning me-2"></i>
                  VINH DANH BẢNG VÀNG
                </h5>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        className="small text-secondary"
                        style={{ width: "70px" }}
                      >
                        Hạng
                      </th>

                      <th className="small text-secondary">Thành viên</th>

                      <th className="small text-secondary text-center">
                        Điểm tích lũy
                      </th>

                      <th className="small text-secondary text-center">
                        Số bài đã thi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rankingMembers.map((member) => (
                      <tr
                        key={member.rank}
                        className={member.rank === 1 ? "table-warning" : ""}
                      >
                        {/* Rank */}
                        <td>
                          {member.rank <= 3 ? (
                            <span
                              style={{
                                fontSize: "25px",
                              }}
                            >
                              {member.rank === 1
                                ? "🥇"
                                : member.rank === 2
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          ) : (
                            <span className="fw-semibold ms-2">
                              {member.rank}
                            </span>
                          )}
                        </td>

                        {/* Member */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "38px",
                                height: "38px",
                                minWidth: "38px",
                              }}
                            >
                              {member.avatar}
                            </div>

                            <div>
                              <div className="fw-semibold small">
                                {member.name}
                              </div>

                              <div className="text-secondary small">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="text-center">
                          <span className="fw-bold text-primary fs-5">
                            {member.score}
                          </span>
                        </td>

                        {/* Exams */}
                        <td className="text-center text-secondary">
                          {member.exams}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="text-center py-3 border-top">
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none"
                >
                  Xem tất cả
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= NEW MEMBERS ================= */}
        <div className="col-12 col-xl-5">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              {/* Title */}
              <div className="p-3 border-bottom">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-fire text-danger me-2"></i>
                  THÀNH VIÊN MỚI NHẤT
                </h5>
              </div>

              {/* Members */}
              <div className="px-3">
                {newMembers.map((member, index) => (
                  <div
                    key={member.email}
                    className={`d-flex align-items-center justify-content-between py-3 ${
                      index !== newMembers.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: "42px",
                          height: "42px",
                        }}
                      >
                        {member.avatar}
                      </div>

                      <div>
                        <div className="fw-semibold small">{member.name}</div>

                        <div className="text-secondary small">
                          {member.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-secondary small">{member.time}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="text-center py-3 border-top">
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none"
                >
                  Xem tất cả thành viên mới
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
