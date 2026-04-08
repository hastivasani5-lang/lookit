import Image from "next/image";
import { ArrowLeft, ArrowRight, User, BookOpen } from "lucide-react";

type Instructor = {
  name: string;
  role: string;
  image: string;
};

const instructors: Instructor[] = [
  { name: "Jesse Pinkman", role: "UI & UX Designer", image: "/pro1.jpeg" },
  { name: "Walter White", role: "UI & UX Designer", image: "/pro2.jpeg" },
  { name: "Skyler White", role: "UI & UX Designer", image: "/pro3.jpeg" },
  { name: "Jane Margolis", role: "UI & UX Designer", image: "/pro4.jpeg" },
];

const socials = ["ig", "f", "v", "tw"];

export default function CoursesInstructorsSection() {
  return (
    <section className="px-4 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-md bg-[#dfeaec] px-4 py-10 md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#2b2b2b] md:text-4xl">
            Our Instructors
          </h2>

          <div className="flex items-center gap-4 text-[#157e78]">
            <button
              type="button"
              aria-label="Previous"
              className="text-2xl leading-none transition hover:opacity-80"
            >
              <ArrowLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="rounded bg-[#c6e3e7] p-2 leading-none transition hover:bg-[#b6d8de]"
            >
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-xl border border-[#dce3e6] bg-white shadow-[0_8px_20px_rgba(33,42,48,0.05)]"
            >
              <div className="relative h-52 w-full bg-[#f2f4f5]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="-mt-4 mb-2 flex justify-center gap-1.5">
                {socials.map((social) => (
                  <button
                    key={`${item.name}-${social}`}
                    type="button"
                    className="h-5 min-w-5 rounded-sm bg-white px-1 text-[10px] font-medium uppercase text-[#3a3f43] shadow"
                  >
                    {social}
                  </button>
                ))}
              </div>

              <div className="px-4 pb-4">
                <h3 className="text-base font-semibold text-[#2d3238]">{item.name}</h3>
                <p className="mt-0.5 text-xs text-[#7c858d]">{item.role}</p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f3] pt-3 text-[11px] text-[#95a1ab]">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    2006 Students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} />
                    12 Courses
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
