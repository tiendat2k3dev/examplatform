"use client";

import ExamsQuestions from "../../../../components/questions/HeaderQuestions";

const Exams = () => {
  const handleAdd = () => {
    console.log("Thêm câu hỏi");
  };

  return (
    <div>
      <ExamsQuestions
        title="Quản lý đề thi"
        description="Tạo, chỉnh sửa, xóa và quản lý đề thi"
        add="Thêm"
        onAdd={handleAdd}
      />
    </div>
  );
};

export default Exams;
