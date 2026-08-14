// src/app/exam-category/page.tsx
"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchPaginatedCategoriesApiAsync } from "@/redux/reducers/CategoryReducer";
import { fetchExamsApiAsync } from "@/redux/reducers/ExamReducer";
import { CategoryHeader } from "@/components/Category/CategoryHeader";
import { CategoryCard } from "@/components/Category/CategoryCard";
import { Pagination } from "@/components/Category/Pagination";

const ExamCategoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    categories = [],
    totalCount = 0,
    currentPage = 1,
    limit = 3,
    loading: catLoading,
  } = useSelector((state: RootState) => state.categoryReducer);

  const { exams = [] } = useSelector((state: RootState) => state.examReducer);

  useEffect(() => {
    dispatch(fetchPaginatedCategoriesApiAsync(1, limit));
    dispatch(fetchExamsApiAsync());
  }, [dispatch, limit]);

  const getExamCount = (categoryId: string) => {
    return exams.filter((exam) => exam.categoryId === categoryId).length;
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchPaginatedCategoriesApiAsync(newPage, limit));
    }
  };

  if (catLoading && categories.length === 0) {
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
      {/* Tiêu đề trang */}
      <CategoryHeader />

      {/* Danh sách nhóm đề thi */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              examCount={getExamCount(cat.id)}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted fs-5">Chưa có nhóm đề thi nào.</p>
          </div>
        )}
      </div>

      {/* Thanh phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={catLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ExamCategoryPage;