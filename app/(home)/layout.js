import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomeLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
