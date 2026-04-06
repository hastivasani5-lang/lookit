"use client";

import Image from "next/image";

const WhyChoose = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-[#eef5f3] relative overflow-hidden">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div data-aos="fade-right">
          <p className="text-sm text-gray-500 flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            WHY CHOOSE US?
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Innovative and effective <br /> learning approaches
          </h2>

          <p className="text-gray-500 mb-6">
            Educate the ultimate destination for knowledge seekers and educators alike.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {["Course Management", "Students Progress", "Live Class", "Quiz"].map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm text-sm">
                ✔ {item}
              </div>
            ))}
          </div>

          <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition">
            GET STARTED →
          </button>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative flex justify-center" data-aos="fade-left">

          <Image
            src="/circle1.jpg"
            alt=""
            width={200}
            height={200}
            className="rounded-full border-8 border-orange-400 absolute top-0 left-10"
          />

          <Image
            src="/circle2.jpg"
            alt=""
            width={200}
            height={200}
            className="rounded-full border-8 border-green-400 absolute top-10 right-0"
          />

          <Image
            src="/circle3.jpg"
            alt=""
            width={220}
            height={220}
            className="rounded-full border-8 border-blue-400 relative z-10"
          />

        </div>

      </div>
    </section>
  );
};

export default WhyChoose;