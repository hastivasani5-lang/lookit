import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = "" }) => (
  <div className={`flex items-center gap-2 mb-4 ${className}`}>
    <span className="w-3 h-3 rounded-full bg-[#008069] inline-block"></span>
    <span className="text-lg md:text-xl font-semibold tracking-wide text-[#232b3b] uppercase">{children}</span>
  </div>
);

export default SectionTitle;
