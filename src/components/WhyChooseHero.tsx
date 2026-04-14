"use client";

import Link from "next/link";
import Image from "next/image";

export default function WhyChooseHero() {
  return (
     <main>
        <section className="relative isolate h-[390px] w-full overflow-hidden bg-[#ecf2ef]">
          <div className="absolute inset-0 bg-[radial-gradient(140%_95%_at_-4%_50%,rgba(77,195,157,0.32)_0%,rgba(77,195,157,0.18)_30%,rgba(236,242,239,0.88)_58%,rgba(236,242,239,0)_100%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_188deg_at_-6%_50%,rgba(45,179,137,0.18),rgba(45,179,137,0.04),rgba(45,179,137,0.2),rgba(45,179,137,0.05),rgba(45,179,137,0.18))]" />

          <div className="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-6 md:px-12 lg:px-16">
            <div className="max-w-xl pt-8">
              <h1 className="text-5xl font-extrabold tracking-[-0.02em] text-[#1b1f2a] md:text-6xl">Why Choose</h1>

              <div className="mt-5 flex items-center gap-3 text-base font-extrabold uppercase tracking-[0.01em] md:text-2xl">
                <Link href="/" className="text-[#22c58b] transition hover:text-[#1ca877]">
                  Home
                </Link>
                <span className="text-[#22c58b]">→</span>
                <span className="text-[#1d2330]">Why Choose</span>
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
      </main>

  );
}