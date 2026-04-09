import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProfessionalsMapSection from "@/components/ProfessionalsMapSection";
import Footer from "@/components/Footer";
import ContactFormCard from "@/components/ContactFormCard";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f6f6f6] pb-12 pt-0">
        <section className="relative isolate h-[390px] w-full overflow-hidden bg-[#ecf2ef]">
          <div className="absolute inset-0 bg-[radial-gradient(140%_95%_at_-4%_50%,rgba(77,195,157,0.32)_0%,rgba(77,195,157,0.18)_30%,rgba(236,242,239,0.88)_58%,rgba(236,242,239,0)_100%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_188deg_at_-6%_50%,rgba(45,179,137,0.18),rgba(45,179,137,0.04),rgba(45,179,137,0.2),rgba(45,179,137,0.05),rgba(45,179,137,0.18))]" />

          <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-6 md:px-12 lg:px-16">
            <div className="max-w-xl pt-8">
              <h1 className="text-5xl font-extrabold tracking-[-0.02em] text-[#1b1f2a] md:text-6xl">Contact</h1>

              <div className="mt-5 flex items-center gap-3 text-base font-extrabold uppercase tracking-[0.01em] md:text-2xl">
                <Link href="/" className="text-[#22c58b] transition hover:text-[#1ca877]">
                  Home
                </Link>
                <span className="text-[#22c58b]">→</span>
                <span className="text-[#1d2330]">Contact</span>
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-[48px] hidden -translate-x-1/2 md:block">
              <div className="relative h-[120px] w-[210px]">
                <div className="absolute inset-0 grid grid-cols-8 gap-2 opacity-80">
                  {Array.from({ length: 64 }).map((_, index) => (
                    <span key={index} className="h-[4px] w-[4px] rounded-full bg-[#2cc390]" />
                  ))}
                </div>
                <Image
                  src="/book-hand.png"
                  alt="Book icon"
                  width={110}
                  height={48}
                  className="absolute left-1/2 top-[30px] -translate-x-1/2 animate-bounce"
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-0 right-0 h-[92%] w-[48%] min-w-[460px] max-w-[760px]">
              <Image
                src="/about1.png"
                alt="Students"
                fill
                sizes="(max-width: 1280px) 58vw, 45vw"
                className="object-contain object-bottom-right"
                priority
              />
            </div>
          </div>
        </section>

        <section className="relative mx-auto mt-10 w-full max-w-[1120px] px-4 md:px-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[20px] bg-transparent p-2 md:p-4">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#22c58b]">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Get In Touch</span>
              </div>

              <h2 className="max-w-[500px] text-3xl font-extrabold leading-tight tracking-[-0.02em] text-[#1d2027] md:text-4xl">
                Trusted By the Genious People with EducateX
              </h2>

              <p className="mt-4 max-w-[560px] text-base leading-7 text-[#666b72]">
                Media leadership skills before cross-media innovation main technology develop standardized platforms without consult.
              </p>

              <div className="mt-7 rounded-[20px] bg-[#e9f3ef] px-5 py-6 md:px-7 md:py-7">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white text-[#22c58b]">
                    <Phone className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xl text-[#6c737b]">Call us Anytime</p>
                    <p className="mt-1 text-2xl font-bold text-[#1f2530]">+123 - (4567) - 890</p>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-[#d9e7e2]" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white text-[#22c58b]">
                    <Mail className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xl text-[#6c737b]">Call us Anytime</p>
                    <p className="mt-1 text-2xl font-bold text-[#1f2530]">example@gmail.com</p>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-[#d9e7e2]" />

                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white text-[#22c58b]">
                    <MapPin className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xl text-[#6c737b]">Our Locations</p>
                    <p className="mt-1 text-2xl leading-[1.45] text-[#163642]">102/B Soltek New Elephant Road California, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactFormCard />
          </div>

          <div className="pointer-events-none absolute bottom-[-16px] right-[12px] hidden grid-cols-8 gap-2 opacity-35 lg:grid">
            {Array.from({ length: 96 }).map((_, index) => (
              <span key={index} className="h-[5px] w-[5px] rounded-full bg-[#22c58b]" />
            ))}
          </div>
        </section>

        <ProfessionalsMapSection />
      </main>

      <Footer />
    </>
  );
}
