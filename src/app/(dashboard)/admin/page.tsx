"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import type { Exam } from "@/types/exam";
import type { Category } from "@/types/categories";

/* =========================================================
   TYPES
========================================================= */

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  avatarUrl?: string;
}

interface History {
  id: string;
  userId: string;
  userName: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswersCount: number;
  timeTaken: number;
  completedAt: string;
}

interface Question {
  id: string;
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

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<User[]>("/users"),
      api.get<Exam[]>("/exams"),
      api.get<Question[]>("/questions"),
      api.get<History[]>("/histories"),
      api.get<Category[]>("/categories"),
    ])
      .then(([u, e, q, h, c]) => {
        setUsers(Array.isArray(u.data) ? u.data : []);
        setExams(Array.isArray(e.data) ? e.data : []);
        setQuestions(Array.isArray(q.data) ? q.data : []);
        setHistories(Array.isArray(h.data) ? h.data : []);
        setCategories(Array.isArray(c.data) ? c.data : []);
      })
      .catch((err) => console.error("Lỗi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, []);

  /* -------------------------------------------------------
     COMPUTED
  ------------------------------------------------------- */
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const userMap = new Map(users.map((u) => [u.id, u]));
  const members = users.filter((u) => u.role === "Member");

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttempts = histories.filter((h) =>
    h.completedAt?.startsWith(todayStr),
  ).length;

  // Lượt thi hôm qua (để tính chênh lệch)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const yesterdayAttempts = histories.filter((h) =>
    h.completedAt?.startsWith(yesterdayStr),
  ).length;

  const recentExams = [...exams]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Top members — dùng tên mới nhất từ userMap
  const scoreMap = new Map<string, { name: string; total: number }>();
  histories.forEach((h) => {
    if (!h.userId || h.userId.startsWith("Public-")) return;
    const prev = scoreMap.get(h.userId);
    scoreMap.set(h.userId, {
      name: userMap.get(h.userId)?.fullName ?? h.userName,
      total: (prev?.total ?? 0) + h.score,
    });
  });
  const topMembers = [...scoreMap.entries()]
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Chart: lượt thi 7 ngày — dùng line chart SVG
  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      dateStr: d.toISOString().slice(0, 10),
      count: 0,
    };
  });
  histories.forEach((h) => {
    if (!h.completedAt) return;
    const found = chartDays.find((d) => d.dateStr === h.completedAt.slice(0, 10));
    if (found) found.count += 1;
  });

  const chartH = 160;
  const chartW = 460;
  const chartMax = Math.max(...chartDays.map((d) => d.count), 1);
  const padL = 36;
  const padB = 24;
  const padT = 16;
  const padR = 12;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const pts = chartDays.map((d, i) => ({
    x: padL + (i / 6) * innerW,
    y: padT + innerH - (d.count / chartMax) * innerH,
    count: d.count,
    label: d.label,
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // Filled area path
  const areaPath =
    `M ${pts[0].x},${padT + innerH} ` +
    pts.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${pts[pts.length - 1].x},${padT + innerH} Z`;

  const yTicks = [0, 1, 2, 3, 4].map((i) =>
    Math.round((chartMax * (4 - i)) / 4),
  );

  /* -------------------------------------------------------
     STATS CARDS CONFIG
  ------------------------------------------------------- */
  const stats = [
    {
      icon: "bi-people-fill",
      color: "primary",
      bg: "#eef2ff",
      iconColor: "#6366f1",
      title: "Tổng thành viên",
      value: members.length.toLocaleString("vi-VN"),
      change: "+0",
      changeText: "so với tháng trước",
    },
    {
      icon: "bi-file-earmark-text-fill",
      color: "success",
      bg: "#f0fdf4",
      iconColor: "#22c55e",
      title: "Tổng đề thi",
      value: exams.length.toLocaleString("vi-VN"),
      change: `+${exams.filter((e) => e.createdAt?.startsWith(todayStr)).length}`,
      changeText: "so với tháng trước",
    },
    {
      icon: "bi-question-circle-fill",
      color: "info",
      bg: "#eff6ff",
      iconColor: "#3b82f6",
      title: "Tổng câu hỏi",
      value: questions.length.toLocaleString("vi-VN"),
      change: "+0",
      changeText: "so với tháng trước",
    },
    {
      icon: "bi-graph-up-arrow",
      color: "warning",
      bg: "#fffbeb",
      iconColor: "#f59e0b",
      title: "Lượt thi hôm nay",
      value: todayAttempts.toLocaleString("vi-VN"),
      change: `+${Math.max(0, todayAttempts - yesterdayAttempts)}`,
      changeText: "so với hôm qua",
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
    <div className="container-fluid bg-light min-vh-100 p-4">

      {/* ===== HEADER ===== */}
      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)" }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold text-dark mb-1">Chào mừng trở lại, Admin! 👋</h4>
              <p className="text-secondary mb-0">
                Quản lý và theo dõi hệ thống trắc nghiệm của bạn.
              </p>
            </div>
            {/* Illustration */}
            <div className="d-none d-md-block" style={{ width: "120px" }}>
              <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="100" height="60" rx="8" fill="#c7d2fe" />
                <rect x="20" y="20" width="80" height="40" rx="4" fill="white" />
                <rect x="28" y="28" width="12" height="24" rx="2" fill="#6366f1" opacity="0.6" />
                <rect x="46" y="34" width="12" height="18" rx="2" fill="#6366f1" opacity="0.8" />
                <rect x="64" y="30" width="12" height="22" rx="2" fill="#6366f1" />
                <rect x="82" y="36" width="12" height="16" rx="2" fill="#6366f1" opacity="0.5" />
                <circle cx="96" cy="14" r="12" fill="#818cf8" />
                <path d="M90 14 L96 20 L104 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.title} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: "50px", height: "50px", background: s.bg }}
                  >
                    <i className={`bi ${s.icon}`} style={{ fontSize: "22px", color: s.iconColor }} />
                  </div>
                  <div>
                    <div className="text-secondary small">{s.title}</div>
                    <div className="fw-bold fs-4 lh-1 text-dark">{s.value}</div>
                    <div className="small mt-1">
                      <span className="text-success fw-semibold">{s.change}</span>{" "}
                      <span className="text-secondary">{s.changeText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHART + MEMBERS ===== */}
      <div className="row g-3 mb-4">

        {/* Line chart */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Thống kê lượt thi trong 7 ngày qua</h6>
                <span className="badge bg-light text-secondary border rounded-pill px-3">
                  7 ngày qua ∨
                </span>
              </div>

              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                width="100%"
                style={{ overflow: "visible" }}
              >
                {/* Y-axis grid + labels */}
                {yTicks.map((tick, i) => {
                  const y = padT + (i / 4) * innerH;
                  return (
                    <g key={tick}>
                      <line x1={padL} y1={y} x2={chartW - padR} y2={y}
                        stroke="#f1f5f9" strokeWidth="1" />
                      <text x={padL - 6} y={y + 4} fontSize="10" fill="#94a3b8"
                        textAnchor="end">{tick}</text>
                    </g>
                  );
                })}

                {/* Filled area */}
                <path d={areaPath} fill="rgba(99,102,241,0.08)" />

                {/* Line */}
                <polyline
                  points={polyline}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Dots + labels */}
                {pts.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#6366f1" />
                    <circle cx={p.x} cy={p.y} r="2" fill="white" />
                    {p.count > 0 && (
                      <text x={p.x} y={p.y - 10} fontSize="10"
                        fill="#6366f1" textAnchor="middle" fontWeight="600">
                        {p.count}
                      </text>
                    )}
                    {/* X-axis label */}
                    <text x={p.x} y={chartH - 4} fontSize="10"
                      fill="#94a3b8" textAnchor="middle">
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Recent members */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold mb-0">Thành viên mới nhất</h6>
                <a href="/admin/members" className="text-primary small text-decoration-none">
                  Xem tất cả
                </a>
              </div>

              {recentMembers.length === 0 ? (
                <p className="text-secondary small text-center py-3">Chưa có thành viên</p>
              ) : (
                recentMembers.map((m) => (
                  <div key={m.id}
                    className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.fullName}
                          className="rounded-circle object-fit-cover flex-shrink-0"
                          style={{ width: "36px", height: "36px" }} />
                      ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-semibold flex-shrink-0"
                          style={{ width: "36px", height: "36px", background: "#eef2ff", color: "#6366f1" }}>
                          {getInitial(m.fullName)}
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold small">{m.fullName}</div>
                        <div className="text-secondary" style={{ fontSize: "12px" }}>{m.email}</div>
                      </div>
                    </div>
                    <small className="text-secondary text-nowrap ms-2" style={{ fontSize: "11px" }}>
                      {formatDate(m.createdAt)}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== EXAMS + RANKING ===== */}
      <div className="row g-3">

        {/* Recent exams */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center px-3 pt-3 pb-2">
                <h6 className="fw-semibold mb-0">Đề thi được tạo gần đây</h6>
                <a href="/admin/exams" className="text-primary small text-decoration-none">
                  Xem tất cả
                </a>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary fw-normal">Mã đề thi</th>
                      <th className="small text-secondary fw-normal">Tên đề thi</th>
                      <th className="small text-secondary fw-normal">Danh mục</th>
                      <th className="small text-secondary fw-normal">Thời gian</th>
                      <th className="small text-secondary fw-normal">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExams.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-secondary py-4">
                          Chưa có đề thi nào
                        </td>
                      </tr>
                    ) : (
                      recentExams.map((exam) => {
                        const isActive = exam.status === "ACTIVE";
                        return (
                          <tr key={exam.id}>
                            <td className="small fw-semibold text-primary">{exam.code}</td>
                            <td className="small">{exam.name}</td>
                            <td className="small text-secondary">
                              {categoryMap.get(exam.categoryId) ?? exam.categoryId}
                            </td>
                            <td className="small">{exam.duration} phút</td>
                            <td>
                              <span className={`badge rounded-pill fw-normal px-3 ${
                                isActive
                                  ? "bg-success-subtle text-success"
                                  : "bg-danger-subtle text-danger"
                              }`}>
                                {isActive ? "Hoạt động" : "Khóa"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Top members */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center px-3 pt-3 pb-2">
                <h6 className="fw-semibold mb-0">Top thành viên có điểm cao</h6>
                <a href="/admin/ranking" className="text-primary small text-decoration-none">
                  Xem tất cả
                </a>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary fw-normal">Hạng</th>
                      <th className="small text-secondary fw-normal">Thành viên</th>
                      <th className="small text-secondary fw-normal text-end">Tổng điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMembers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-secondary py-4">
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      topMembers.map((member, idx) => {
                        const rank = idx + 1;
                        return (
                          <tr key={member.userId}>
                            <td style={{ width: "60px" }}>
                              {rank <= 3 ? (
                                <span style={{ fontSize: "20px" }}>
                                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                                </span>
                              ) : (
                                <span className="small fw-semibold ms-1">{rank}</span>
                              )}
                            </td>
                            <td className="small">{member.name}</td>
                            <td className="text-end small fw-semibold">
                              {member.total} điểm
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-secondary small py-4">
        © 2026 Online Quiz. All rights reserved.
      </div>
    </div>
  );
};

export default AdminPage;
