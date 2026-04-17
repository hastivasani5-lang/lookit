import Image from "next/image";
import { Check } from "lucide-react";

const leftFeatures = [
  "Verified Professionals",
  "Advanced Search Filters",
  "Trusted Reviews & Ratings",
  "Special Needs Support",
];

const rightFeatures = [
  "Easy Profile Browsing",
  "Location-Based Search",
  "Secure User Experience",
  "Personalized Learning Support",
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
            The Key Features of Lookit
          </h2>

          <p className="mt-3 max-w-3xl text-base leading-7 text-black/70 sm:text-lg lg:text-[18px] lg:leading-[1.75]">
            Lookit connects students and parents with trusted education professionals, making it easy to find and connect with reliable learning support.
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

        </div>

        {/* MAIN IMAGE */}
                 <div className="relative h-[260px] w-[260px] animate-float sm:h-[320px] sm:w-[320px] md:h-[380px] md:w-[380px] lg:h-[420px] lg:w-[420px]">
                   <Image
                     src="/img1.png"
                     alt="students"
                     fill
                     sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 380px, 420px"
                     className="object-contain"
                   />
                 </div>
       
                 {/* DOTS */}
                 <div className="absolute right-3 top-8 hidden grid-cols-4 gap-1 sm:grid sm:right-10 sm:top-12 lg:right-20">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <span key={i} className="w-1.5 h-1.5 bg-[#1ec28e] rounded-full"></span>
                   ))}
                 </div>
       
                 {/* STAR */}
                 <div className="absolute bottom-14 left-2 hidden h-10 w-10 items-center justify-center rounded-full border border-[#1ec28e]/55 text-lg text-[#1ec28e] animate-pulse sm:flex sm:bottom-20 sm:left-6 sm:h-12 sm:w-12 sm:text-xl lg:bottom-24 lg:left-10">
                   *
                 </div>
       
                 {/* EXPERIENCE CARD */}
                 <div className="absolute bottom-4 right-2 flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-lg animate-float sm:bottom-8 sm:right-0 sm:px-5 sm:py-2.5 lg:bottom-16 lg:px-6 lg:py-3">
       
                   <div className="w-10 h-10 bg-[#1ec28e] text-white rounded-full flex items-center justify-center">
                     ★
                   </div>
       
                   <div>
                     <p className="font-bold text-lg text-gray-900">26+</p>
                     <p className="text-xs text-gray-500">Years of Experiences</p>
                   </div>
       
                 </div>
       
      </div>
    </section>
  );
}
