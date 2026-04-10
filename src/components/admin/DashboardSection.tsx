import React from "react";

const DashboardSection: React.FC = () => (
  <div className="rounded-2xl neumorph-admin-card p-4 sm:p-5">
    <h2 className="text-3xl font-semibold text-slate-800">Welcome.</h2>
    <p className="mb-4 text-sm text-slate-500">Navigate the future of education with Schooli.</p>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl neumorph-admin-stat p-4">
        <p className="text-xs text-[#2c5a48]">Students</p>
        <p className="text-3xl font-bold text-[#0f2c21]">15.00K</p>
      </div>
      <div className="rounded-2xl neumorph-admin-stat p-4">
        <p className="text-xs text-[#2c5a48]">Teachers</p>
        <p className="text-3xl font-bold text-[#0f2c21]">200</p>
      </div>
      <div className="rounded-2xl neumorph-admin-stat p-4">
        <p className="text-xs text-[#2c5a48]">Awards</p>
        <p className="text-3xl font-bold text-[#0f2c21]">5.6K</p>
      </div>
    </div>
    {/* Add more dashboard widgets here if needed */}
  </div>
);

export default DashboardSection;
