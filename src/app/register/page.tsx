import RegisterForm from "@/components/Register/RegisterForm";
import styles from "./Register.module.css";

export const metadata = {
  title: "Đăng Ký - CodeGym Exam IT",
};

const RegisterPage = () => {
  return (
    <main className={`container-flex position-relative ${styles.mainContainer}`}>
      {/* Vòng tròn phát sáng rực rỡ trang trí nền */}
      <div className={`position-absolute rounded-circle opacity-40 ${styles.glowCircle1}`}></div>
      <div className={`position-absolute rounded-circle opacity-40 ${styles.glowCircle2}`}></div>
      
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;