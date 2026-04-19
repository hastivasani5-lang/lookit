"use client";

const steps = [
  {
    step: "01",
    title: "Sign Up",
    desc: "Create your free account to get started on your learning journey.",
  },
  {
    step: "02",
    title: "Browse Courses",
    desc: "Explore a wide range of courses and select the ones that fit your goals.",
  },
  {
    step: "03",
    title: "Enroll & Learn",
    desc: "Enroll in your chosen course and start learning with interactive lessons.",
  },
  {
    step: "04",
    title: "Complete Assignments",
    desc: "Practice your skills with assignments and real-world projects.",
  },
  {
    step: "05",
    title: "Get Certified",
    desc: "Earn certificates and showcase your achievements to the world.",
  },
];

export default function StepFlow() {
  return (
    <section className="py-20 bg-[#eef5f3]">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-[#1e2a55] mb-16">
          How It Works
        </h2>

        {/* STEPS */}
        <div className="relative">

          {/* Vertical line (mobile view) */}
          <div className="absolute left-1/2 top-0 w-[2px] h-full bg-gray-200 -translate-x-1/2 md:hidden"></div>

          <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-5 md:gap-6">

            {steps.map((item, index) => {
              const isTop = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col items-center">

                  {/* CONNECTOR LINE (desktop) */}
                  {index !== steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-gray-200 z-0"></div>
                  )}

                  {/* CARD */}
                  <div
                    className={`relative z-10 w-full max-w-[220px] bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center
                    ${isTop ? "md:mb-20" : "md:mt-20"}`}
                  >
                    {/* STEP BADGE */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1ec28e] text-white w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold shadow">
                      {item.step}
                    </div>

                    <h3 className="mt-6 font-semibold text-[#1e2a55]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>
  );
}