import Faq from "@/components/layout/Faq";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col pb-5">
      <Navbar />
      {children}
      <Faq />
      <Footer />
    </div>
  );
}
