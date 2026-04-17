"use client";

import { Brain, ShieldCheck, Network } from "lucide-react";

const FeaturesStrip = () => {
  return (
    <section className="w-full bg-[#e9f2ef] py-12 px-4 md:px-10 relative overflow-hidden">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ITEM 1 */}
        <div className="flex items-start gap-4">
          <div className="text-[#1ec28e]">
            <Brain size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Specialized Learning Support
            </h3>
            <p className="text-gray-500 text-sm mt-1 leading-6">
             Connect with experts supporting needs like speech therapy, ADHD, and dyslexia.
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="flex items-start gap-4">
          <div className="text-[#ff7a2f]">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
             Trusted Platform
            </h3>
            <p className="text-gray-500 text-sm mt-1 leading-6">
              A reliable platform connecting users with trusted education professionals and services.
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="flex items-start gap-4">
          <div className="text-[#3bb4ff]">
            <Network size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Expert Connections
            </h3>
            <p className="text-gray-500 text-sm mt-1 leading-6">
              Easily connect with experienced professionals who provide quality educational support.
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE DECORATION */}
      <div className="absolute right-6 bottom-0 hidden md:block">
        <div className="w-2 h-20 bg-green-500 rounded-full opacity-60"></div>
      </div>

    </section>
  );
};

export default FeaturesStrip;