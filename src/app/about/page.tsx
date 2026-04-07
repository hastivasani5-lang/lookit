import Navbar from "@/components/Navbar";
import About from "@/components/About";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <About />
      </main>
    </>
  );
}
