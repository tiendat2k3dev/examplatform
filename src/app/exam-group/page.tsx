// src/app/exam-group/page.tsx
"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPaginatedExamGroupsApiAsync } from "@/redux/reducers/ExamGroupReducer";
import { fetchExamsApiAsync } from "@/redux/reducers/ExamReducer";
import { ExamGroupHeader } from "@/components/ExamGroup/ExamGroupHeader";
import { ExamGroupCard } from "@/components/ExamGroup/ExamGroupCard";
import { Pagination } from "@/components/ExamGroup/Pagination";

const ExamGroupPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    examGroups = [],
    totalCount = 0,
    currentPage = 1,
    limit = 3,
    loading: groupLoading,
  } = useSelector((state: RootState) => state.examGroupReducer);

  const { exams = [] } = useSelector((state: RootState) => state.examReducer);

  useEffect(() => {
    dispatch(fetchPaginatedExamGroupsApiAsync(1, limit));
    dispatch(fetchExamsApiAsync());
  }, [dispatch, limit]);

  // Log kiểm tra dữ liệu
  console.log("ExamGroups State:", examGroups);
  console.log("Total Count:", totalCount);

  const getExamCount = (categoryId: string) => {
    return exams.filter((exam) => exam.categoryId === categoryId).length;
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchPaginatedExamGroupsApiAsync(newPage, limit));
    }
  };

  if (groupLoading && (!examGroups || examGroups.length === 0)) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải nhóm đề thi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ExamGroupHeader />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {Array.isArray(examGroups) && examGroups.length > 0 ? (
          examGroups.map((group) => (
            <ExamGroupCard
              key={group.id}
              examGroup={group}
              examCount={getExamCount(group.id)}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">Chưa có nhóm đề thi nào.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={groupLoading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ExamGroupPage;