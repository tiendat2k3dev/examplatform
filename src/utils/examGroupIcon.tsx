import type { ExamGroup } from "./examGroup";

/**
 * Helper để hiển thị icon Bootstrap hoặc text thuần
 */
export const renderExamGroupIcon = (icon: string, className?: string) => {
  const trimmed = icon.trim();

  // Nếu là Bootstrap icon class (bắt đầu bằng bi- hoặc chứa bi-)
  if (trimmed.startsWith("bi-") || trimmed.includes("bi-")) {
    // Lấy phần bi-... cuối cùng nếu có nhiều class
    const iconClass = trimmed.includes(" ")
      ? trimmed.split(" ").find((part) => part.startsWith("bi-")) ?? trimmed
      : trimmed;

    return (
      <i
        className={`bi ${iconClass} ${className ?? ""}`}
        aria-hidden="true"
      />
    );
  }

  // Nếu là text thuần, hiển thị text
  return <span className={className}>{trimmed}</span>;
};
