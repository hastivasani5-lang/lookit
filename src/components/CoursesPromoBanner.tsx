import { ArrowRight, Sparkles } from "lucide-react";

export default function CoursesPromoBanner() {
  return (
    <section className="px-4 pb-20 md:px-10 lg:px-16">
      <div className="mx-auto w-full overflow-hidden rounded-[28px] bg-linear-to-r from-[#0f766e] via-[#0f9f8d] to-[#14b8a6] p-px shadow-[0_20px_60px_rgba(15,118,110,0.25)]">
        <div className="relative rounded-[27px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(120deg,#0f766e,#14b8a6)] px-6 py-10 md:px-10 md:py-12">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 left-1/3 h-36 w-36 rounded-full bg-emerald-200/20 blur-2xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                <Sparkles size={14} />
                New Batch Open
              </p>
              <h3 className="max-w-2xl text-2xl font-bold leading-tight text-white md:text-4xl">
                Ready To Upgrade Your Skills?
                <br />
                Join 5000+ Learners This Month.
              </h3>
              <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
                Live mentorship, practical projects, and career-focused roadmap.
                Secure your seat before enrollment closes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0f766e] transition hover:bg-[#ecfeff]"
              >
                Explore Courses
                <ArrowRight size={16} className="ml-2" />
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/50 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk To Advisor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
