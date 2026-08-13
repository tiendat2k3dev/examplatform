import LoginForm from "@/components/Login/LoginForm";
import styles from "./Login.module.css";

export const metadata = {
  title: "Đăng Nhập - CodeGym Exam IT",
};

const LoginPage = () => {
  return (
    <main className={`container-flex position-relative ${styles.mainContainer}`}>
      {/* Vòng tròn phát sáng trang trí nền */}
      <div
        className={`position-absolute rounded-circle opacity-40 ${styles.glowCircle1}`}
      ></div>
      <div
        className={`position-absolute rounded-circle opacity-40 ${styles.glowCircle2}`}
      ></div>
      <LoginForm />
    </main>
  );
};

export default LoginPage;