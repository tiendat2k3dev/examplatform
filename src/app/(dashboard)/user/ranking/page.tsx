"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import api from "@/lib/apiClient";
import styles from "./Ranking.module.css";

/* ================= TYPES ================= */
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

interface RankEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  totalScore: number;
  examCount: number;
}

/* ================= HELPERS ================= */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getInitial = (name: string) => name?.trim()?.charAt(0)?.toUpperCase() || "U";

export default function RankingPage() {
  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const [users, setUsers] = useState<User[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get<User[]>("/users"), api.get<History[]>("/histories")])
      .then(([u, h]) => {
        setUsers(Array.isArray(u.data) ? u.data : []);
        setHistories(Array.isArray(h.data) ? h.data : []);
        setLastUpdated(
          new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        );
      })
      .catch((err) => console.error("Lỗi fetch ranking:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const members = users.filter((u) => u.role === "Member");
  const userMap = new Map(users.map((u) => [u.id, u]));

  const scoreMap = new Map<string, { totalScore: number; examCount: number; userName: string }>();
  histories.forEach((h) => {
    if (!h.userId || h.userId.startsWith("Public-")) return;
    const prev = scoreMap.get(h.userId);
    scoreMap.set(h.userId, {
      totalScore: (prev?.totalScore ?? 0) + h.score,
      examCount: (prev?.examCount ?? 0) + 1,
      userName: h.userName,
    });
  });

  const ranking: RankEntry[] = [...scoreMap.entries()]
    .map(([userId, data]) => {
      const user = userMap.get(userId);
      return {
        rank: 0,
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

  // Tìm xếp hạng của User đang đăng nhập
  const myRankEntry = currentUser
    ? ranking.find((r) => String(r.userId) === String(currentUser.id))
    : null;

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const top1 = ranking[0] ?? null;
  const newestMember = recentMembers[0] ?? null;

  if (loading) {
    return (
      <div className={`${styles.rankingWrapper} d-flex justify-content-center align-items-center`}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rankingWrapper}>
      <div className={styles.glowBg1}></div>
      <div className={styles.glowBg2}></div>

      <div className="container-fluid py-4 px-3 px-md-5 position-relative z-1">
        {/* ================= HEADER ================= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <h2 className={`fw-bold mb-1 ${styles.gradientTitle}`}>
              <i className="bi bi-trophy-fill text-warning me-2"></i> BẢNG XẾP HẠNG
            </h2>
            <p className="text-light opacity-50 small mb-0">
              Vinh danh các thành viên có tổng điểm thi tích lũy xuất sắc nhất
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {lastUpdated && (
              <span className="badge bg-dark border border-secondary border-opacity-50 text-light opacity-75 px-3 py-2">
                Cập nhật lúc: {lastUpdated}
              </span>
            )}
            <button
              type="button"
              onClick={fetchData}
              className="btn btn-outline-info btn-sm px-3 py-2 fw-semibold rounded-3 d-flex align-items-center gap-1.5"
            >
              <i className="bi bi-arrow-clockwise"></i> Làm mới
            </button>
          </div>
        </div>

        {/* ================= THẺ THỐNG KÊ (4 CARDS CÂN BẰNG) ================= */}
        <div className="row g-3 mb-4 align-items-stretch">
          {/* Card 1: Hạng hiện tại của User */}
          <div className="col-12 col-sm-6 col-xl-3 d-flex">
            <div className={`w-100 ${styles.userStatCard}`}>
              <div
                className={styles.iconBox}
                style={{ background: "rgba(14, 165, 233, 0.25)", color: "#38bdf8" }}
              >
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <div className="d-flex flex-column justify-content-center overflow-hidden">
                <small className="text-info d-block text-uppercase fw-bold" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                  Hạng Của Bạn
                </small>
                {myRankEntry ? (
                  <>
                    <div className="fs-4 fw-bold text-white mt-0.5">
                      Hạng #{myRankEntry.rank}
                    </div>
                    <small className="text-light opacity-75" style={{ fontSize: "0.75rem" }}>
                      {myRankEntry.totalScore} Điểm &bull; {myRankEntry.examCount} Bài thi
                    </small>
                  </>
                ) : (
                  <>
                    <div className="fs-6 fw-bold text-white mt-1">Chưa có hạng</div>
                    <small className="text-light opacity-50" style={{ fontSize: "0.72rem" }}>
                      Hãy làm bài thi đầu tiên!
                    </small>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Tổng thành viên */}
          <div className="col-12 col-sm-6 col-xl-3 d-flex">
            <div className={`w-100 ${styles.statCard}`}>
              <div
                className={styles.iconBox}
                style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}
              >
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="d-flex flex-column justify-content-center">
                <small className="text-light opacity-50 d-block text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                  Tổng thành viên
                </small>
                <div className="fs-4 fw-bold text-white mt-0.5">
                  {members.length}{" "}
                  <span className="fs-6 fw-normal text-light opacity-50">thành viên</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Thành viên mới nhất */}
          <div className="col-12 col-sm-6 col-xl-3 d-flex">
            <div className={`w-100 ${styles.statCard}`}>
              <div
                className={styles.iconBox}
                style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80" }}
              >
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <div className="d-flex flex-column justify-content-center overflow-hidden">
                <small className="text-light opacity-50 d-block text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                  Gia nhập mới nhất
                </small>
                <div className="fs-5 fw-bold text-white text-truncate mt-0.5">
                  {newestMember ? newestMember.fullName : "---"}
                </div>
                <small className="text-success small" style={{ fontSize: "0.72rem" }}>
                  {newestMember ? formatDate(newestMember.createdAt) : ""}
                </small>
              </div>
            </div>
          </div>

          {/* Card 4: Quán quân Bảng Vàng */}
          <div className="col-12 col-sm-6 col-xl-3 d-flex">
            <div className={`w-100 ${styles.statCard}`}>
              <div
                className={styles.iconBox}
                style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}
              >
                <i className="bi bi-award-fill"></i>
              </div>
              <div className="d-flex flex-column justify-content-center overflow-hidden">
                <small className="text-light opacity-50 d-block text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                  Quán Quân Bảng Vàng
                </small>
                <div className={`fs-5 fw-bold text-truncate mt-0.5 ${styles.goldText}`}>
                  {top1 ? top1.name : "Chưa có"}
                </div>
                {top1 && (
                  <div className="mt-1">
                    <span
                      className="badge rounded-pill px-2.5 py-1 border"
                      style={{
                        backgroundColor: "rgba(251, 191, 36, 0.15)",
                        borderColor: "rgba(251, 191, 36, 0.4)",
                        color: "#fbbf24",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {top1.totalScore} Điểm tích lũy
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BẢNG VINH DANH & THÀNH VIÊN ================= */}
        <div className="row g-4 align-items-stretch">
          {/* Cột 1: Bảng Vinh Danh */}
          <div className="col-12 col-xl-8">
            <div className={`${styles.glassCard} overflow-hidden h-100`}>
              <div className={`d-flex justify-content-between align-items-center ${styles.tableCardHeader}`}>
                <span className={`text-white d-flex align-items-center gap-2 ${styles.tableCardHeaderTitle}`}>
                  <i className="bi bi-stars text-warning fs-5"></i> TOP THÀNH VIÊN XUẤT SẮC
                </span>
                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-3 py-1.5 fw-semibold">
                  {ranking.length} Học viên
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th className="text-center" style={{ width: "80px" }}>Hạng</th>
                      <th>Học viên</th>
                      <th className="text-center">Tổng điểm</th>
                      <th className="text-center">Số bài thi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-5 text-light opacity-50 bg-transparent">
                          <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                          Chưa có lịch sử làm bài thi
                        </td>
                      </tr>
                    ) : (
                      ranking.map((member) => {
                        const isMe = currentUser && String(member.userId) === String(currentUser.id);
                        return (
                          <tr
                            key={member.userId}
                            className={`${styles.tableRow} ${isMe ? styles.currentUserRow : ""}`}
                          >
                            {/* Rank Icon */}
                            <td className="text-center">
                              {member.rank === 1 ? (
                                <span style={{ fontSize: "1.6rem" }}>🥇</span>
                              ) : member.rank === 2 ? (
                                <span style={{ fontSize: "1.5rem" }}>🥈</span>
                              ) : member.rank === 3 ? (
                                <span style={{ fontSize: "1.4rem" }}>🥉</span>
                              ) : (
                                <span className="fw-bold text-dark">#{member.rank}</span>
                              )}
                            </td>

                            {/* Member Details */}
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-3 border border-secondary border-opacity-50 overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                                  style={{ width: "46px", height: "46px", background: "rgba(15, 23, 42, 0.9)" }}
                                >
                                  {member.avatarUrl ? (
                                    <img
                                      src={member.avatarUrl}
                                      alt={member.name}
                                      className="w-100 h-100 rounded-2"
                                      style={{ objectFit: "contain" }}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://placehold.co/80x80/1e293b/white?text=U";
                                      }}
                                    />
                                  ) : (
                                    <span className="fw-bold text-info fs-6">{getInitial(member.name)}</span>
                                  )}
                                </div>
                                <div className="overflow-hidden">
                                  <div className={`text-truncate d-flex align-items-center gap-1.5 ${styles.textBlackPrimary}`}>
                                    {member.name}
                                    {member.rank === 1 && (
                                      <i className="bi bi-crown-fill text-warning small ms-1"></i>
                                    )}
                                    {isMe && (
                                      <span className="badge bg-primary rounded-pill px-2 py-0.5 small ms-1" style={{ fontSize: "0.68rem" }}>
                                        Bạn
                                      </span>
                                    )}
                                  </div>
                                  {member.email && (
                                    <div className={`text-truncate d-block ${styles.textBlackSecondary}`}>
                                      {member.email}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Điểm */}
                            <td className="text-center">
                              <span className="fw-bold fs-5 text-info">
                                {member.totalScore.toLocaleString("vi-VN")}
                              </span>
                            </td>

                            {/* Số lượt làm bài */}
                            <td className="text-center">
                              <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2.5 py-1 fw-semibold">
                                {member.examCount} bài
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

          {/* Cột 2: Thành viên mới */}
          <div className="col-12 col-xl-4">
            <div className={`${styles.glassCard} p-4 h-100 d-flex flex-column`}>
              <h5 className="fw-bold text-white mb-3.5 d-flex align-items-center gap-2" style={{ fontSize: "1.15rem" }}>
                <i className="bi bi-fire text-danger"></i> THÀNH VIÊN GIA NHẬP MỚI
              </h5>

              <div className={`d-flex flex-column gap-2.5 flex-grow-1 ${styles.memberList}`}>
                {recentMembers.length === 0 ? (
                  <div className="text-center text-light opacity-50 my-auto py-4">
                    Chưa có thành viên mới
                  </div>
                ) : (
                  recentMembers.map((m) => (
                    <div
                      key={m.id}
                      className="d-flex align-items-center justify-content-between p-2.5 rounded-3"
                      style={{ background: "rgba(255, 255, 255, 0.03)" }}
                    >
                      <div className="d-flex align-items-center overflow-hidden">
                        <div className={styles.memberAvatarBox}>
                          {m.avatarUrl ? (
                            <img
                              src={m.avatarUrl}
                              alt={m.fullName}
                              className="w-100 h-100 rounded-2"
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <span className="fw-bold text-light opacity-75 small">
                              {getInitial(m.fullName)}
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="fw-semibold text-white small text-truncate">
                            {m.fullName}
                          </div>
                          <small className="text-light opacity-50 text-truncate d-block" style={{ fontSize: "0.72rem" }}>
                            {m.email}
                          </small>
                        </div>
                      </div>
                      <small className="text-light opacity-50 text-nowrap ms-2" style={{ fontSize: "0.72rem" }}>
                        {formatDate(m.createdAt).split(" ")[0]}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}