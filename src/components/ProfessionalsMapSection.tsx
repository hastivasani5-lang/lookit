"use client";

import dynamic from "next/dynamic";
import { professionals } from "@/app/professionals/data";

const ProfessionalsMap = dynamic(() => import("./ProfessionalsMap"), { ssr: false });

export default function ProfessionalsMapSection() {
  const locations = professionals.map((pro) => pro.location);

  return (
    <section className="mt-12 w-full px-0">
      <div className="w-full rounded-none border-y border-[#ececec] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:rounded-[22px] sm:border sm:p-5 md:p-7">
        <h3 className="text-center text-2xl font-extrabold tracking-[-0.02em] text-[#1d2027] md:text-3xl">
          Our Professionals Across India
        </h3>
        <p className="mt-2 text-center text-sm text-[#666b72]">
          Red dots represent all locations listed on the professionals page.
        </p>
        <ProfessionalsMap locations={locations} />
      </div>
    </section>
  );
}
