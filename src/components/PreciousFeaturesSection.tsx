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
    <section className="relative overflow-hidden bg-[#e9f2ef] px-3 py-5 text-black md:px-5 md:py-7 lg:px-10 lg:py-8">
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

      <div className="relative mx-auto grid w-full max-w-[1080px] items-center gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-3">
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[48px]">
            The predicious Features for you
          </h2>

          <p className="mt-3 max-w-3xl text-base leading-7 text-black/70 sm:text-lg lg:text-[18px] lg:leading-[1.75]">
            Many desktop publishing packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for will uncover many web sites still in their infancy. Various versions
            have evolved over the years, sometimes by accident, sometimes on purpose
          </p>

          <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div className="space-y-4">
              {leftFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/40 text-black flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-lg font-medium tracking-[0.01em] sm:text-xl">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {rightFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/40 text-black flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-lg font-medium tracking-[0.01em] sm:text-xl">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center rounded-lg bg-[#ef5350] px-6 py-3 text-base font-semibold text-black transition hover:bg-[#e54845]"
            >
              Start Learning
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center rounded-lg bg-[#1ec28e] px-6 py-3 text-base font-semibold text-black transition hover:bg-[#18ab7d]"
            >
              View More
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] self-end lg:max-w-[360px]">
          <Image
            src="/girls.png"
            alt="Student"
            width={360}
            height={430}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
