import * as Yup from "yup";

const questionSchema = Yup.object({
  content: Yup.string().trim().required("Vui lòng nhập câu hỏi"),

  categoryId: Yup.string().required("Vui lòng chọn danh mục"),

  answers: Yup.object({
    A: Yup.string().trim().required("Vui lòng nhập đáp án A"),
    B: Yup.string().trim().required("Vui lòng nhập đáp án B"),
    C: Yup.string().trim().required("Vui lòng nhập đáp án C"),
    D: Yup.string().trim().required("Vui lòng nhập đáp án D"),
  }),

  correctAnswer: Yup.string()
    .oneOf(["A", "B", "C", "D"], "Vui lòng chọn đáp án đúng")
    .required("Vui lòng chọn đáp án đúng"),
});

export default questionSchema;
