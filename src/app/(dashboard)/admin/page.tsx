"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import type { Exam } from "@/types/exam";
import type { Category } from "@/types/categories";

/* =========================================================
   RAW TYPES từ db.json
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
  content: string;
  categoryId: string;
}

/* =========================================================
   HELPER
========================================================= */

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase();

/* =========================================================
   COMPONENT
========================================================= */

const AdminPage = () => {
  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     FETCH ALL
  ------------------------------------------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, examsRes, questionsRes, historiesRes, categoriesRes] =
          await Promise.all([
            api.get<User[]>("/users"),
            api.get<Exam[]>("/exams"),
            api.get<Question[]>("/questions"),
            api.get<History[]>("/histories"),
            api.get<Category[]>("/categories"),
          ]);

        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setExams(Array.isArray(examsRes.data) ? examsRes.data : []);
        setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : []);
        setHistories(Array.isArray(historiesRes.data) ? historiesRes.data : []);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
        );
      } catch (err) {
        console.error("Lỗi tải dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* -------------------------------------------------------
     COMPUTED STATS
  ------------------------------------------------------- */
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const totalMembers = users.filter((u) => u.role === "Member").length;

  const totalExams = exams.length;

  const totalQuestions = questions.length;

  // Lượt thi hôm nay
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttempts = histories.filter((h) =>
    h.completedAt?.startsWith(todayStr),
  ).length;

  // 5 đề thi mới nhất (sort theo createdAt)
  const recentExams = [...exams]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // 5 thành viên đăng ký mới nhất
  const recentMembers = [...users]
    .filter((u) => u.role === "Member")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Top thành viên: gộp histories theo userId, tính tổng score
  const scoreMap = new Map<string, { name: string; total: number }>();
  histories.forEach((h) => {
    if (!h.userId || h.userId.startsWith("Public-")) return;
    const prev = scoreMap.get(h.userId);
    scoreMap.set(h.userId, {
      name: h.userName,
      total: (prev?.total ?? 0) + h.score,
    });
  });
  const topMembers = [...scoreMap.entries()]
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  /* -------------------------------------------------------
     STATS CARDS
  ------------------------------------------------------- */
  const stats = [
    {
      icon: "bi-people-fill",
      title: "Tổng thành viên",
      value: totalMembers.toLocaleString("vi-VN"),
      color: "primary",
    },
    {
      icon: "bi-file-earmark-text-fill",
      title: "Tổng đề thi",
      value: totalExams.toLocaleString("vi-VN"),
      color: "success",
    },
    {
      icon: "bi-question-circle-fill",
      title: "Tổng câu hỏi",
      value: totalQuestions.toLocaleString("vi-VN"),
      color: "info",
    },
    {
      icon: "bi-graph-up-arrow",
      title: "Lượt thi hôm nay",
      value: todayAttempts.toLocaleString("vi-VN"),
      color: "warning",
    },
  ];

  /* -------------------------------------------------------
     RENDER – LOADING
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
     RENDER – MAIN
  ------------------------------------------------------- */
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
                style={{ width: "130px", height: "70px" }}
              >
                <i
                  className="bi bi-bar-chart-line-fill text-primary"
                  style={{ fontSize: "40px" }}
                />
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
                    style={{ width: "48px", height: "48px", minWidth: "48px" }}
                  >
                    <i
                      className={`bi ${stat.icon}`}
                      style={{ fontSize: "21px" }}
                    />
                  </div>
                  <div>
                    <div className="text-secondary small">{stat.title}</div>
                    <div className="fw-bold fs-4 text-dark">{stat.value}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EXAMS + MEMBERS ================= */}
      <div className="row g-3 mb-3">
        {/* Đề thi gần đây */}
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
                    {recentExams.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center text-secondary py-4"
                        >
                          Chưa có đề thi nào
                        </td>
                      </tr>
                    ) : (
                      recentExams.map((exam) => {
                        const isActive = exam.status === "ACTIVE";
                        return (
                          <tr key={exam.id}>
                            <td className="small fw-semibold text-primary">
                              {exam.code}
                            </td>
                            <td className="small">{exam.name}</td>
                            <td className="small text-secondary">
                              {categoryMap.get(exam.categoryId) ??
                                exam.categoryId}
                            </td>
                            <td className="small">{exam.duration} phút</td>
                            <td>
                              <span
                                className={`badge rounded-pill fw-normal ${
                                  isActive
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
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

        {/* Thành viên mới nhất */}
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

              {recentMembers.length === 0 ? (
                <p className="text-secondary small text-center py-3">
                  Chưa có thành viên nào
                </p>
              ) : (
                recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="d-flex align-items-center justify-content-between py-2 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-2">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.fullName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: "36px", height: "36px" }}
                        />
                      ) : (
                        <div
                          className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                          style={{ width: "36px", height: "36px" }}
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
            </div>
          </div>
        </div>
      </div>

      {/* ================= RANKING ================= */}
      <div className="row g-3">
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
                    {topMembers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center text-secondary py-4"
                        >
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      topMembers.map((member, idx) => {
                        const rank = idx + 1;
                        return (
                          <tr key={member.userId}>
                            <td>
                              {rank <= 3 ? (
                                <span style={{ fontSize: "18px" }}>
                                  {rank === 1
                                    ? "🥇"
                                    : rank === 2
                                      ? "🥈"
                                      : "🥉"}
                                </span>
                              ) : (
                                <span className="small fw-semibold">{rank}</span>
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

        {/* Thống kê lượt thi gần đây */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center p-3">
                <h6 className="fw-bold mb-0">Lịch sử thi gần đây</h6>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-secondary">Học viên</th>
                      <th className="small text-secondary">Đề thi</th>
                      <th className="small text-secondary text-center">
                        Điểm
                      </th>
                      <th className="small text-secondary">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {histories.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-secondary py-4"
                        >
                          Chưa có lịch sử thi
                        </td>
                      </tr>
                    ) : (
                      [...histories]
                        .sort(
                          (a, b) =>
                            new Date(b.completedAt).getTime() -
                            new Date(a.completedAt).getTime(),
                        )
                        .slice(0, 6)
                        .map((h) => (
                          <tr key={h.id}>
                            <td className="small fw-semibold">{h.userName}</td>
                            <td
                              className="small text-truncate"
                              style={{ maxWidth: "180px" }}
                            >
                              {h.examTitle}
                            </td>
                            <td className="text-center">
                              <span
                                className={`badge rounded-pill ${
                                  h.score >= 50
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {h.score}%
                              </span>
                            </td>
                            <td className="small text-secondary text-nowrap">
                              {formatDate(h.completedAt)}
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
      </div>

      {/* Footer */}
      <div className="text-center text-secondary small py-3">
        © 2026 Online Quiz. All rights reserved.
      </div>
    </div>
  );
};

export default AdminPage;
