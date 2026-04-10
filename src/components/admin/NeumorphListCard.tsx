import React from "react";

interface NeumorphListCardProps {
  children: React.ReactNode;
  className?: string;
}

const NeumorphListCard: React.FC<NeumorphListCardProps> = ({ children, className = "" }) => (
  <li className={`flex flex-wrap items-center gap-4 rounded-2xl neumorph-admin-card p-4 shadow-[4px_4px_16px_#d0dbd6,-4px_-4px_16px_#ffffff] bg-white ${className}`}>
    {children}
  </li>
);

export default NeumorphListCard;
