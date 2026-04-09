"use client";

import { GraduationCap, Users, BadgeDollarSign } from "lucide-react";

const Features = () => {
  return (
    <section className="w-full py-24 px-4 md:px-8 bg-[#f8f9fb] relative overflow-hidden">
      
      {/* TOP HEADER */}
      <div className="mx-auto mb-16 max-w-7xl text-center lg:text-left">
        
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
              <span className="w-2 h-2 bg-[#1ec28e] rounded-full"></span>
              CORE FEATURES
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-right">
              Interactive Online Learning <br />
              Key Features & Benefits
            </h2>
          </div>

        </div>

      </div>

      {/* CARDS */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* CARD 1 */}
        <div 
          data-aos="fade-up"
          className="bg-[#e9f5f1] rounded-3xl p-8 text-center transition hover:shadow-xl lg:text-left"
        >
          <GraduationCap className="w-10 h-10 text-[#1ec28e] mb-6" />
          <h3 className="text-xl font-semibold text-gray-900">
            Learning Experiences
          </h3>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            The ultimate destination for knowledge for We are committed to transforming
          </p>
        </div>

        {/* CARD 2 */}
        <div 
          data-aos="fade-up"
          data-aos-delay="200"
          className="bg-[#f6ece7] rounded-3xl p-8 text-center transition hover:shadow-xl lg:text-left"
        >
          <Users className="w-10 h-10 text-orange-500 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900">
            Professional Instructor
          </h3>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            The ultimate destination for knowledge for We are committed to transforming
          </p>
        </div>

        {/* CARD 3 */}
        <div 
          data-aos="fade-up"
          data-aos-delay="400"
          className="bg-[#eaf2f8] rounded-3xl p-8 text-center transition hover:shadow-xl lg:text-left"
        >
          <BadgeDollarSign className="w-10 h-10 text-blue-500 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900">
            Moneyback Guarantee
          </h3>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            The ultimate destination for knowledge for We are committed to transforming
          </p>
        </div>

      </div>

    </section>
  );
};

export default Features;