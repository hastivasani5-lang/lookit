"use client";

import { GraduationCap, Users, BadgeDollarSign } from "lucide-react";

const Features = () => {
  return (
    <section className="w-full py-24 px-4 md:px-8 bg-[#f8f9fb] relative overflow-hidden">
      
      {/* TOP HEADER */}
      <div className="max-w-7xl mx-auto mb-16">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

          {/* LEFT */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              CORE FEATURES
            </div>

            {/* LINE */}
            <div className="mt-3 w-full h-px bg-gray-300"></div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight text-left lg:text-right">
              Interactive Online Learning <br />
              Key Features & Benefits
            </h2>
          </div>

        </div>

      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* CARD 1 */}
        <div 
          data-aos="fade-up"
          className="bg-[#e9f5f1] p-8 rounded-3xl hover:shadow-xl transition"
        >
          <GraduationCap className="w-10 h-10 text-green-500 mb-6" />
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
          className="bg-[#f6ece7] p-8 rounded-3xl hover:shadow-xl transition"
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
          className="bg-[#eaf2f8] p-8 rounded-3xl hover:shadow-xl transition"
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