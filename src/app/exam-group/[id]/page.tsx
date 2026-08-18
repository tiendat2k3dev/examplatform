// src/app/exam-group/[id]/page.tsx
"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchExamGroupsApiAsync } from "@/redux/reducers/ExamGroupReducer";
import { fetchPaginatedExamsApiAsync } from "@/redux/reducers/ExamReducer";
import { toast } from "react-toastify";
import { ExamHeader } from "@/components/ExamGroup/ExamHeader";
import { ExamCard } from "@/components/ExamGroup/ExamCard";
import { Pagination } from "@/components/ExamGroup/Pagination";


const CategoryExamsPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const categoryId = params.id as string;

  const { examGroups = [] } = useSelector(
    (state: RootState) => state.examGroupReducer
  );

  const {
    exams = [],
    totalCount = 0,
    currentPage = 1,
    limit = 6,
    loading: examLoading,
  } = useSelector((state: RootState) => state.examReducer);

  const { currentUser } = useSelector((state: RootState) => state.authReducer);

  const currentGroup = examGroups.find((group) => group.id === categoryId);

  useEffect(() => {
    if (examGroups.length === 0) {
      dispatch(fetchExamGroupsApiAsync());
    }
    if (categoryId) {
      dispatch(fetchPaginatedExamsApiAsync(1, limit, categoryId));
    }
  }, [dispatch, categoryId, limit, examGroups.length]);

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      dispatch(fetchPaginatedExamsApiAsync(newPage, limit, categoryId));
    }
  };

  const handleStartExam = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  // Chỉ hiển thị đề thi đang mở (ACTIVE)
  const activeExams = exams.filter((exam) => exam.status === "ACTIVE");

  if (examLoading && exams.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải bài thi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ExamHeader examGroup={currentGroup} totalExams={totalCount} />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {activeExams.length > 0 ? (
          activeExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onStartExam={handleStartExam}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted fs-5">Chưa có bài thi nào thuộc nhóm này.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={examLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryExamsPage;