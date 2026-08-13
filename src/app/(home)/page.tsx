import ExamSubjects from "@/components/Home/ExamSubjects/ExamSubjects";
import HomeHero from "@/components/Home/HomeHero/HomeHero";
import SupportSection from "@/components/Home/SupportSection/SupportSection";

// chưa đăng nhập
const Home = () => {
  return (
    // MAIN CONTENT
    <main className="container my-5">
      {/* SECTION 1: BANNER CHÍNH & TÌM KIẾM */}
      <HomeHero/>
      {/* SECTION 2: DANH SÁCH MÔN THI LẬP TRÌNH */}
      <ExamSubjects/>
      {/* SECTION 3: HỖ TRỢ TRỰC TUYẾN*/}
      <SupportSection />
    </main>
  );
};
export default Home;
