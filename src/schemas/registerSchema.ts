import * as Yup from "yup";

export const registerSchema = Yup.object({
  username: Yup.string()
    .max(25, "Tên đăng nhập tối đa 25 ký tự")
    .required("Vui lòng nhập tên đăng nhập"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  fullName: Yup.string().required("Vui lòng nhập họ và tên"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  address: Yup.string().required("Vui lòng nhập địa chỉ"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "Bạn phải đồng ý với điều khoản dịch vụ",
  ),
});
