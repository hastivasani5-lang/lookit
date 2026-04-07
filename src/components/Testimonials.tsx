"use client";

import Image from "next/image";

const Testimonials = () => {
  return (
    <section className="bg-[#e6efed] py-20 px-4 md:px-10 lg:px-16">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
       <div className="max-w-7xl mx-auto mb-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-[#1ec28e] rounded-full"></span>
              TESTIMONIALS

            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight text-left lg:text-right">
Real Experiences From Our
 <br />
Dedicated Learners
            </h2>
          </div>

        </div>

      </div>

        {/* ================= MAIN SECTION ================= */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ================= LEFT ================= */}
          <div className="relative">

            {/* IMAGE AREA */}
            <div className="relative h-[420px]">

              {/* GREEN CIRCLE */}
              <div className="absolute w-[300px] h-[300px] bg-green-500 rounded-full top-16 left-16"></div>

              {/* MAIN IMAGE */}
              <Image
                src="/girls.png"
                alt=""
                width={320}
                height={420}
                className="absolute bottom-0 left-10 z-10"
              />

              {/* AVATARS */}
              <div className="absolute top-6 left-0 w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow">
                <Image src="/pro1.jpeg" fill className="object-cover" alt="" />
              </div>

              <div className="absolute bottom-6 left-0 w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow">
                <Image src="/pro2.jpeg" fill className="object-cover" alt="" />
              </div>

              <div className="absolute top-24 right-10 w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow">
                <Image src="/pro3.jpeg" fill className="object-cover" alt="" />
              </div>

            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div>

            {/* CARD */}
            <div className="bg-white rounded-[18px] p-8 shadow-md">

              <p className="text-green-500 text-2xl mb-3">❝</p>

              <h3 className="font-semibold text-lg text-[#0f172a] mb-3">
                Impressive Learning!
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Educate the ultimate destination for knowledge seekers and educators.
                We are committed to transforming special education impact globally.
              </p>

              <div className="text-orange-500 mb-5">★★★★★</div>

              {/* USER */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/pro1.jpeg" width={50} height={50} alt="" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f172a]">Sumona Aktar</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                </div>

                {/* ARROWS */}
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-green-500 hover:text-white transition">
                    ←
                  </button>
                  <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-green-500 hover:text-white transition">
                    →
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= CTA ================= */}
        <div className="mt-20 bg-[#22c55e] rounded-[18px] px-8 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* LEFT */}
          <h3 className="text-white text-xl md:text-2xl font-semibold leading-snug text-center md:text-left">
            Learn Anytime, Anywhere <br />
            Start Your Free Trial!
          </h3>

          {/* CENTER */}
          <div className="text-white text-center">
            <p className="text-sm opacity-80">Call Anytime</p>
            <p className="font-semibold text-lg">+123 (4567) 890</p>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3 shadow">
            <span className="text-green-500 text-xl">★</span>
            <div>
              <p className="font-semibold">Trustpilot</p>
              <p className="text-sm text-gray-500">890+ Trustpilot 4.9 Ratings</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;