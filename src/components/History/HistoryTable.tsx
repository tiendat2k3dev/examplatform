// src/components/History/HistoryTable.tsx
import React from "react";
import { History } from "@/types/history";
import styles from "@/app/history/History.module.css";

interface HistoryTableProps {
  histories: History[];
  startIndex: number;
  onViewDetail: (history: History) => void;
}

export const HistoryTable = ({
  histories,
  startIndex,
  onViewDetail,
}: HistoryTableProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")} phút`;
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const getSubjectBadge = (examId: string) => {
    if (examId.includes("java")) return { name: "Java", color: "danger" };
    if (examId.includes("csharp")) return { name: "C# .NET", color: "primary" };
    if (examId.includes("frontend")) return { name: "Frontend", color: "warning" };
    if (examId.includes("db")) return { name: "SQL", color: "success" };
    if (examId.includes("cpp")) return { name: "C++", color: "info" };
    if (examId.includes("python")) return { name: "Python", color: "secondary" };
    return { name: "IT General", color: "info" };
  };

  return (
    <div className={`card shadow-lg rounded-4 text-white overflow-hidden mb-4 ${styles.glassCard}`}>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle m-0" style={{ background: "transparent" }}>
            <thead className={`text-info ${styles.tableHeader}`}>
              <tr>
                <th className="py-3 ps-4">STT</th>
                <th className="py-3">Tên Bài Thi</th>
                <th className="py-3">Môn Học</th>
                <th className="py-3">Ngày Làm</th>
                <th className="py-3">Thời Gian</th>
                <th className="py-3">Điểm Số</th>
                <th className="py-3">Trạng Thái</th>
                <th className="py-3 text-end pe-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {histories && histories.length > 0 ? (
                histories.map((h, idx) => {
                  const isPassed = h.score >= 50;
                  const score10 = ((h.score / 100) * 10).toFixed(1);
                  const badgeInfo = getSubjectBadge(h.examId);

                  return (
                    <tr key={h.id || idx}>
                      <td className="ps-4 text-light opacity-75">{startIndex + idx + 1}</td>
                      <td className="fw-bold text-white">{h.examTitle || `Bài thi ${h.examId}`}</td>
                      <td>
                        <span className={`badge text-${badgeInfo.color} border border-${badgeInfo.color} ${styles.subjectBadge}`}>
                          {badgeInfo.name}
                        </span>
                      </td>
                      <td className="text-light opacity-75">{formatDate(h.completedAt)}</td>
                      <td className="text-light opacity-75">{formatDuration(h.timeTaken)}</td>
                      <td className={`fw-bold fs-6 ${isPassed ? "text-success" : "text-danger"}`}>
                        {score10} / 10
                      </td>
                      <td>
                        <span
                          className={`badge border px-3 py-1 rounded-pill ${
                            isPassed
                              ? `text-success border-success ${styles.badgePass}`
                              : `text-danger border-danger ${styles.badgeFail}`
                          }`}
                        >
                          {isPassed ? "Đạt" : "Chưa đạt"}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          type="button"
                          onClick={() => onViewDetail(h)}
                          className="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-light opacity-50">
                    <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                    Bạn chưa làm bài thi nào. Bấm &quot;Thi Bài Mới&quot; để bắt đầu ôn luyện!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};