import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const leftFeatures = [
  "Online Classes",
  "Books Online/Offline",
  "Long Term Courses",
  "Cooking Classes",
];

const rightFeatures = [
  "Offline Classes",
  "Short Term Courses",
  "Music Classes",
  "Networking Courses",
];

export default function PreciousFeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#5f62df_0%,#5b61d9_45%,#6d65e8_100%)] px-4 py-10 text-white md:px-8 md:py-12 lg:px-16 lg:py-14">
      {/* soft network background */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute left-[6%] top-[18%] h-6 w-6 rounded-full bg-white/20" />
        <div className="absolute left-[45%] top-[8%] h-20 w-20 rounded-full bg-white/15" />
        <div className="absolute right-[10%] top-[24%] h-14 w-14 rounded-full bg-white/15" />
        <div className="absolute right-[4%] bottom-[26%] h-8 w-8 rounded-full bg-white/20" />
        <div className="absolute left-[2%] bottom-[10%] h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* books texture */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <Image src="/start.png" alt="Background" fill className="object-cover" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[48px]">
            The predicious Features for you
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/80 sm:text-base lg:text-[18px] lg:leading-[1.75]">
            Many desktop publishing packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for will uncover many web sites still in their infancy. Various versions
            have evolved over the years, sometimes by accident, sometimes on purpose
          </p>

          <div className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div className="space-y-4">
              {leftFeatures.map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/14 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-xl font-medium tracking-[0.01em] sm:text-2xl">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {rightFeatures.map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/14 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-xl font-medium tracking-[0.01em] sm:text-2xl">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/get-started"
              className="inline-flex items-center rounded-xl bg-[#ef5350] px-7 py-3 text-base font-semibold text-white transition hover:bg-[#e54845]"
            >
              Start Learning
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center rounded-xl bg-[#1ec28e] px-7 py-3 text-base font-semibold text-white transition hover:bg-[#18ab7d]"
            >
              View More
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] self-end lg:max-w-[560px]">
          <Image
            src="/girls.png"
            alt="Student"
            width={560}
            height={680}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
