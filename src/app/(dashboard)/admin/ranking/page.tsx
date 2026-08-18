"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

/* =========================================================
   RAW TYPES
========================================================= */

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

interface History {
  id: string;
  userId: string;
  userName: string;
  score: number;
  completedAt: string;
}

/* =========================================================
   COMPUTED TYPES
========================================================= */

interface RankEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  totalScore: number;
  examCount: number;
}

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

/* =========================================================
   COMPONENT
========================================================= */

const Ranking = () => {
  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */
  const [users, setUsers] = useState<User[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  /* -------------------------------------------------------
     FETCH
  ------------------------------------------------------- */
  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get<User[]>("/users"),
      api.get<History[]>("/histories"),
    ])
      .then(([u, h]) => {
        setUsers(Array.isArray(u.data) ? u.data : []);
        setHistories(Array.isArray(h.data) ? h.data : []);
        setLastUpdated(
          new Date().toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      })
      .catch((err) => console.error("Lỗi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------------------------------------------
     COMPUTED
  ------------------------------------------------------- */
  const members = users.filter((u) => u.role === "Member");

  // Build user lookup map: id → User
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Gộp histories theo userId: tổng điểm + số bài thi
  const scoreMap = new Map<
    string,
    { totalScore: number; examCount: number; userName: string }
  >();
  histories.forEach((h) => {
    if (!h.userId || h.userId.startsWith("Public-")) return;
    const prev = scoreMap.get(h.userId);
    scoreMap.set(h.userId, {
      totalScore: (prev?.totalScore ?? 0) + h.score,
      examCount: (prev?.examCount ?? 0) + 1,
      userName: h.userName,
    });
  });

  // Build ranking list, sort theo totalScore giảm dần
  const ranking: RankEntry[] = [...scoreMap.entries()]
    .map(([userId, data]) => {
      const user = userMap.get(userId);
      return {
        rank: 0, // gán sau khi sort
        userId,
        name: user?.fullName ?? data.userName,
        email: user?.email ?? "",
        avatarUrl: user?.avatarUrl,
        totalScore: data.totalScore,
        examCount: data.examCount,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  // 5 thành viên mới nhất
  const recentMembers = [...members]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Thẻ thống kê nhanh
  const top1 = ranking[0] ?? null;
  const newestMember = recentMembers[0] ?? null;

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */
  return (
    <div className="container-fluid bg-light min-vh-100 px-4 py-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-2">
            BẢNG XẾP HẠNG (RANKING)
          </h2>
          <p className="text-secondary mb-0 small">
            Vinh danh các thành viên có số điểm tích lũy cao nhất.
          </p>
        </div>

        <div className="text-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm mb-2"
            onClick={fetchData}
          >
            <i className="bi bi-arrow-clockwise me-2" />
            Cập nhật
          </button>
          {lastUpdated && (
            <div className="small text-secondary">
              Cập nhật lúc: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="row g-3 mb-3">
        {/* Tổng thành viên */}
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "58px", height: "58px" }}
              >
                <i className="bi bi-people-fill" style={{ fontSize: "25px" }} />
              </div>
              <div>
                <div className="text-secondary small">Tổng thành viên</div>
                <div className="fw-bold fs-4">
                  {members.length.toLocaleString("vi-VN")}{" "}
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
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "58px", height: "58px" }}
              >
                <i
                  className="bi bi-person-plus-fill"
                  style={{ fontSize: "25px" }}
                />
              </div>
              <div>
                <div className="text-secondary small">Thành viên mới nhất</div>
                {newestMember ? (
                  <>
                    <div className="fw-bold fs-5">{newestMember.fullName}</div>
                    <small className="text-secondary">
                      {formatDate(newestMember.createdAt)}
                    </small>
                  </>
                ) : (
                  <div className="text-secondary small">Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top 1 */}
        <div className="col-12 col-md-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "58px", height: "58px" }}
              >
                <i
                  className="bi bi-trophy-fill"
                  style={{ fontSize: "25px" }}
                />
              </div>
              <div>
                <div className="text-secondary small">Top 1 hiện tại</div>
                {top1 ? (
                  <>
                    <div className="fw-bold fs-5">{top1.name}</div>
                    <div className="fw-semibold text-warning">
                      {top1.totalScore} điểm
                    </div>
                  </>
                ) : (
                  <div className="text-secondary small">Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="row g-3">

        {/* ===== RANKING TABLE ===== */}
        <div className="col-12 col-xl-7">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              <div className="p-3 border-bottom">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-trophy-fill text-warning me-2" />
                  VINH DANH BẢNG VÀNG
                </h5>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary" style={{ width: "70px" }}>
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
                    {ranking.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-secondary py-5">
                          <i className="bi bi-inbox fs-3 d-block mb-2" />
                          Chưa có dữ liệu xếp hạng
                        </td>
                      </tr>
                    ) : (
                      ranking.map((member) => (
                        <tr
                          key={member.userId}
                          className={member.rank === 1 ? "table-warning" : ""}
                        >
                          {/* Rank */}
                          <td>
                            {member.rank <= 3 ? (
                              <span style={{ fontSize: "25px" }}>
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
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.name}
                                  className="rounded-circle object-fit-cover flex-shrink-0"
                                  style={{ width: "38px", height: "38px" }}
                                />
                              ) : (
                                <div
                                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                  style={{ width: "38px", height: "38px" }}
                                >
                                  {getInitial(member.name)}
                                </div>
                              )}
                              <div>
                                <div className="fw-semibold small">
                                  {member.name}
                                  {member.rank === 1 && (
                                    <span className="ms-1 text-warning">
                                      <i className="bi bi-crown-fill" />
                                    </span>
                                  )}
                                </div>
                                {member.email && (
                                  <div className="text-secondary small">
                                    {member.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Score */}
                          <td className="text-center">
                            <span className="fw-bold text-primary fs-5">
                              {member.totalScore}
                            </span>
                          </td>

                          {/* Exam count */}
                          <td className="text-center text-secondary">
                            {member.examCount}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ===== NEW MEMBERS ===== */}
        <div className="col-12 col-xl-5">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              <div className="p-3 border-bottom">
                <h5 className="fw-bold text-primary mb-0">
                  <i className="bi bi-fire text-danger me-2" />
                  THÀNH VIÊN MỚI NHẤT
                </h5>
              </div>

              <div className="px-3">
                {recentMembers.length === 0 ? (
                  <div className="text-center text-secondary py-5">
                    <i className="bi bi-inbox fs-3 d-block mb-2" />
                    Chưa có thành viên nào
                  </div>
                ) : (
                  recentMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className={`d-flex align-items-center justify-content-between py-3 ${
                        index !== recentMembers.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.fullName}
                            className="rounded-circle object-fit-cover flex-shrink-0"
                            style={{ width: "42px", height: "42px" }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                            style={{ width: "42px", height: "42px" }}
                          >
                            {getInitial(member.fullName)}
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold small">{member.fullName}</div>
                          <div className="text-secondary small">{member.email}</div>
                        </div>
                      </div>
                      <div className="text-secondary small text-nowrap ms-2">
                        {formatDate(member.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center py-3 border-top">
                <a
                  href="/admin/members"
                  className="btn btn-link text-primary text-decoration-none"
                >
                  Xem tất cả thành viên mới
                  <i className="bi bi-arrow-right ms-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
