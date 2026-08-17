import api from "@/lib/apiClient";
import { Category } from "@/types/categories";

// =====================================================
// CHUẨN HÓA TÊN CATEGORY
// =====================================================
// Ví dụ:
// "Sách"      -> "sach"
// "sách"      -> "sach"
// "S A C H"   -> "sach"
// "s a c h"   -> "sach"
// " Sach "    -> "sach"
// =====================================================

const normalizeCategoryName = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .trim();
};

// =====================================================
// LẤY DANH SÁCH CATEGORY
// =====================================================

export const getCategoriesService = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách danh mục:", error);
    throw error;
  }
};

// =====================================================
// LẤY CATEGORY THEO ID
// =====================================================

export const getCategoryByIdService = async (
  categoryId: string,
): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/${categoryId}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin danh mục:", error);
    throw error;
  }
};

// =====================================================
// KIỂM TRA TÊN CATEGORY ĐÃ TỒN TẠI
// =====================================================
// excludeId dùng khi sửa.
// Ví dụ đang sửa category id = "1":
// "Sách" của chính nó không bị coi là trùng.
// =====================================================

export const checkCategoryNameExistsService = async (
  name: string,
  excludeId?: string,
): Promise<boolean> => {
  try {
    const categories = await getCategoriesService();

    const normalizedName = normalizeCategoryName(name);

    return categories.some((category) => {
      // Khi sửa, bỏ qua chính category đang sửa
      if (excludeId && category.id === excludeId) {
        return false;
      }

      return normalizeCategoryName(category.name) === normalizedName;
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra tên danh mục:", error);

    throw error;
  }
};

// =====================================================
// THÊM CATEGORY
// =====================================================

export const createCategoryService = async (
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Promise<Category> => {
  try {
    // Kiểm tra tên rỗng
    if (!categoryData.name.trim()) {
      throw new Error("Tên danh mục không được để trống!");
    }

    // Kiểm tra tên trùng
    const exists = await checkCategoryNameExistsService(categoryData.name);

    if (exists) {
      throw new Error("Tên danh mục đã tồn tại!");
    }

    const response = await api.post<Category>("/categories", {
      ...categoryData,
      name: categoryData.name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);

    throw error;
  }
};

// =====================================================
// SỬA CATEGORY
// =====================================================

export const updateCategoryService = async (
  categoryId: string,
  categoryData: Partial<Category>,
): Promise<Category> => {
  try {
    // Nếu có sửa tên thì kiểm tra trùng
    if (categoryData.name !== undefined) {
      // Kiểm tra tên rỗng
      if (!categoryData.name.trim()) {
        throw new Error("Tên danh mục không được để trống!");
      }

      const exists = await checkCategoryNameExistsService(
        categoryData.name,
        categoryId,
      );

      if (exists) {
        throw new Error("Tên danh mục đã tồn tại!");
      }
    }

    const payload: Partial<Category> = {
      ...categoryData,
      ...(categoryData.name !== undefined && {
        name: categoryData.name.trim(),
      }),
      updatedAt: new Date().toISOString(),
    };

    const response = await api.patch<Category>(
      `/categories/${categoryId}`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);

    throw error;
  }
};

// =====================================================
// XÓA CATEGORY
// =====================================================

export const deleteCategoryService = async (
  categoryId: string,
): Promise<void> => {
  try {
    await api.delete(`/categories/${categoryId}`);
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);

    throw error;
  }
};

// =====================================================
// TÌM KIẾM CATEGORY
// =====================================================
// Tìm kiếm không phân biệt:
// - Hoa/thường
// - Có dấu/không dấu
// - Khoảng trắng
//
// Ví dụ:
// "sach" tìm được "Sách"
// "S A C H" tìm được "Sách"
// =====================================================

export const searchCategoriesService = async (
  keyword: string,
): Promise<Category[]> => {
  try {
    const categories = await getCategoriesService();

    const search = normalizeCategoryName(keyword);

    if (!search) {
      return categories;
    }

    return categories.filter((category) =>
      normalizeCategoryName(category.name).includes(search),
    );
  } catch (error) {
    console.error("Lỗi khi tìm kiếm danh mục:", error);

    throw error;
  }
};
