export interface History {
  id: string;
  userId: string;
  examId: string;
  examTitle?: string;            // Tên đề thi (để hiển thị nhanh ở trang Lịch sử)
  score: number;                 // Điểm số (thang điểm 100)
  totalQuestions: number;        // Tổng số câu hỏi
  correctAnswersCount: number;   // Số câu trả lời đúng
  timeTaken: number;             // Thời gian hoàn thành (tính bằng giây)
  completedAt: string;           // Thời gian nộp bài (ISO String, e.g., "2026-08-14T10:30:00.000Z")
  userAnswers: Record<string, number>; // Mapping { [questionId]: selectedOptionIndex }
}

// Payload khi nộp bài thi thành công
export type SubmitExamPayload = Omit<History, "id" | "completedAt">;