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

interface Exam {
  id: string;
  code: string;
  name: string;
  status: string;
}

interface Question {
  id: string;
}

interface History {
  id: string;
  userId: string;
  userName: string;
  examId: string;
  examTitle: string;
  score: number;
  completedAt: string;
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

const Statistics = () => {
  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     FETCH
  ------------------------------------------------------- */
  useEffect(() => {
    Promise.all([
      api.get<User[]>("/users"),
      api.get<Exam[]>("/exams"),
      api.get<Question[]>("/questions"),
      api.get<History[]>("/histories"),
    ])
      .then(([u, e, q, h]) => {
        setUsers(Array.isArray(u.data) ? u.data : []);
        setExams(Array.isArray(e.data) ? e.data : []);
        setQuestions(Array.isArray(q.data) ? q.data : []);
        setHistories(Array.isArray(h.data) ? h.data : []);
      })
      .catch((err) => console.error("Lỗi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  /* -------------------------------------------------------
     COMPUTED
  ------------------------------------------------------- */

  const members = users.filter((u) => u.role === "Member");

  // Thành viên đăng ký trong 7 ngày gần đây
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newMemberCount = members.filter(
    (u) => new Date(u.createdAt).getTime() >= sevenDaysAgo,
  ).length;

  // 5 thành viên mới nhất
  const recentMembers = [...members]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Build user lookup map: id → User
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Gộp histories theo userId: tổng điểm tích lũy
  interface RankEntry {
    userId: string;
    name: string;
    avatarUrl?: string;
    total: number;
  }
  const scoreMap = new Map<string, RankEntry>();
  histories.forEach((h) => {
    if (!h.userId || h.userId.startsWith("Public-")) return;
    const user = userMap.get(h.userId);
    const prev = scoreMap.get(h.userId);
    scoreMap.set(h.userId, {
      userId: h.userId,
      // Ưu tiên tên mới nhất từ bảng users, fallback về userName trong history
      name: user?.fullName ?? h.userName,
      avatarUrl: user?.avatarUrl,
      total: (prev?.total ?? 0) + h.score,
    });
  });
  const ranking = [...scoreMap.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  /* -------------------------------------------------------
     CARDS CONFIG
  ------------------------------------------------------- */
  const cards = [
    {
      icon: "bi-people-fill",
      color: "primary",
      stroke: "#7c5ce6",
      label: "Tổng thành viên",
      value: members.length.toLocaleString("vi-VN"),
      sub: `${newMemberCount} thành viên mới 7 ngày qua`,
      subColor: "success",
    },
    {
      icon: "bi-person-plus-fill",
      color: "success",
      stroke: "#35a875",
      label: "Thành viên mới (7 ngày)",
      value: newMemberCount.toLocaleString("vi-VN"),
      sub: "so với tuần trước",
      subColor: "success",
    },
    {
      icon: "bi-file-earmark-text-fill",
      color: "primary",
      stroke: "#4598df",
      label: "Tổng đề thi",
      value: exams.length.toLocaleString("vi-VN"),
      sub: `${exams.filter((e) => e.status === "ACTIVE").length} đề đang mở`,
      subColor: "success",
    },
    {
      icon: "bi-question-circle-fill",
      color: "warning",
      stroke: "#e6a23c",
      label: "Tổng câu hỏi",
      value: questions.length.toLocaleString("vi-VN"),
      sub: "trong ngân hàng câu hỏi",
      subColor: "secondary",
    },
  ];

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
          <h2 className="fw-bold text-primary mb-2">THỐNG KÊ HỆ THỐNG</h2>
          <p className="text-secondary mb-0 small">
            Tổng quan số liệu thành viên, đề thi và câu hỏi trong hệ thống.
          </p>
        </div>
      </div>

      {/* ===================== STATS CARDS ===================== */}
      <div className="row g-3 mb-3">
        {cards.map((card) => (
          <div key={card.label} className="col-12 col-md-6 col-xl-3">
            <div className="card border shadow-sm h-100">
              <div className="card-body">
                <div
                  className={`rounded-circle bg-${card.color}-subtle text-${card.color} d-flex align-items-center justify-content-center`}
                  style={{ width: "52px", height: "52px" }}
                >
                  <i className={`bi ${card.icon}`} style={{ fontSize: "23px" }} />
                </div>

                <div className="mt-2">
                  <div className="small text-secondary">{card.label}</div>
                  <div className="fs-3 fw-bold text-dark">{card.value}</div>
                  <div className={`small text-${card.subColor}`}>
                    <i className="bi bi-arrow-up me-1" />
                    {card.sub}
                  </div>
                </div>

                {/* Sparkline decorative */}
                <div className="mt-2">
                  <svg width="100%" height="35" viewBox="0 0 220 35" preserveAspectRatio="none">
                    <path
                      d="M0 28 C20 20, 25 30, 45 18 S70 8, 90 18 S115 5, 135 15 S160 30, 180 13 S200 25, 220 8"
                      fill="none"
                      stroke={card.stroke}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== RANKING + MEMBERS ===================== */}
      <div className="row g-3">

        {/* ===== RANKING ===== */}
        <div className="col-12 col-xl-7">
          <div className="card border shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    <i className="bi bi-trophy-fill text-warning me-2" />
                    Vinh danh bảng vàng
                  </h5>
                  <p className="text-secondary small mb-0">
                    Top thành viên có số điểm tích lũy cao nhất
                  </p>
                </div>
                <a
                  href="/admin/ranking"
                  className="btn btn-outline-primary btn-sm"
                >
                  Xem tất cả <i className="bi bi-arrow-right ms-2" />
                </a>
              </div>

              <div className="px-3 pb-3">
                {ranking.length === 0 ? (
                  <div className="text-center text-secondary py-4">
                    <i className="bi bi-inbox fs-3 d-block mb-2" />
                    Chưa có dữ liệu
                  </div>
                ) : (
                  ranking.map((member, idx) => {
                    const rank = idx + 1;
                    return (
                      <div
                        key={member.userId}
                        className={`d-flex align-items-center justify-content-between px-3 py-3 border-bottom ${
                          rank === 1 ? "bg-warning-subtle" : ""
                        }`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          {/* Rank badge */}
                          <div
                            className="d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: "35px", fontSize: rank <= 3 ? "22px" : "16px" }}
                          >
                            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                          </div>

                          {/* Avatar */}
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="rounded-circle object-fit-cover"
                              style={{ width: "40px", height: "40px" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {getInitial(member.name)}
                            </div>
                          )}

                          {/* Name */}
                          <div className="fw-semibold">
                            {member.name}
                            {rank === 1 && (
                              <span className="ms-2 text-warning">
                                <i className="bi bi-crown-fill" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        <div>
                          <span
                            className={`fw-bold ${rank === 1 ? "text-warning" : "text-dark"}`}
                            style={{ fontSize: "18px" }}
                          >
                            {member.total}
                          </span>
                          <span className="small text-secondary ms-1">điểm</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== THÀNH VIÊN MỚI ===== */}
        <div className="col-12 col-xl-5">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-people-fill text-primary me-2" />
                Thống kê thành viên
              </h5>

              {/* Summary boxes */}
              <div className="d-flex align-items-center justify-content-between bg-primary-subtle rounded p-3 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="bi bi-people-fill" />
                  </div>
                  <div>
                    <div className="fw-semibold small">Tổng thành viên</div>
                    <div className="text-secondary small">Toàn bộ thành viên hệ thống</div>
                  </div>
                </div>
                <span className="fw-bold text-primary fs-5">
                  {members.length.toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between bg-success-subtle rounded p-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="bi bi-person-plus-fill" />
                  </div>
                  <div>
                    <div className="fw-semibold small">Thành viên mới (7 ngày)</div>
                    <div className="text-secondary small">Đăng ký gần đây nhất</div>
                  </div>
                </div>
                <span className="fw-bold text-success fs-5">{newMemberCount}</span>
              </div>

              {/* Recent member list */}
              <h6 className="fw-bold mb-2">Thành viên mới nhất</h6>

              {recentMembers.length === 0 ? (
                <p className="text-secondary small text-center py-3">
                  Chưa có thành viên nào
                </p>
              ) : (
                recentMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={`d-flex align-items-center justify-content-between py-2 ${
                      index !== recentMembers.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.fullName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: "38px", height: "38px" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "38px", height: "38px" }}
                        >
                          {getInitial(member.fullName)}
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold small">{member.fullName}</div>
                        <div className="text-secondary small">{member.email}</div>
                      </div>
                    </div>
                    <small className="text-secondary text-nowrap ms-2">
                      {formatDate(member.createdAt)}
                    </small>
                  </div>
                ))
              )}

              <div className="mt-3">
                <a
                  href="/admin/members"
                  className="btn btn-link text-primary text-decoration-none p-0"
                >
                  Xem tất cả thành viên
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

export default Statistics;
