"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Secure Payment",
    desc: "Your transactions are protected with industry-leading security.",
  },
  {
    title: "Fast Delivery",
    desc: "Get your products delivered quickly and reliably to your doorstep.",
  },
  {
    title: "Easy Returns",
    desc: "Hassle-free returns and exchanges for a worry-free shopping experience.",
  },
  {
    title: "24/7 Support",
    desc: "Our support team is available around the clock to assist you.",
  },
];

const WhyUpskill = () => {
  return (
    <section className="px-4 md:px-10 lg:px-16  bg-white">
      
      <div className="grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Image */}
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src="/banner-img2.jpg"
            alt="Why Upskill"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            Why Shop With Us?
          </h2>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {features.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Icon */}
                <CheckCircle className="text-[#1ec28e] w-5 h-5 mt-1" />
                {/* Text */}
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

           
        </div>

      </div>
    </section>
  );
};

export default WhyUpskill;