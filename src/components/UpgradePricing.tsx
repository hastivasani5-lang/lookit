"use client";
import React from "react";

const plans = [
  { name: "Starter", price: 9, duration: "1 week boost" },
  { name: "Pro", price: 19, duration: "1 month boost" },
  { name: "Premium", price: 39, duration: "2 months boost" },
  { name: "Elite", price: 59, duration: "3 months boost" },
];

export default function UpgradePricing() {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold text-[#1a2b3c] mb-1">Upgrade summary</h2>
      <div className="text-[#7b8794] mb-6">Your profile is currently visible as a standard professional profile.</div>
      <div className="space-y-4 mb-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`flex items-center justify-between rounded-2xl border ${idx === 0 ? "border-green-300 bg-[#f7fbf9]" : "border-[#e5eaf0] bg-white"} px-6 py-5`}
          >
            <div>
              <div className="font-bold text-xl text-[#1a2b3c] mb-1">{plan.name}</div>
              <div className="text-[#7b8794] text-base">{plan.duration}</div>
            </div>
            <div className="font-bold text-2xl text-[#1ec28e]">₹{plan.price}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-[#f7fbf9] px-6 py-5 mb-4">
        <div className="font-bold text-[#1a2b3c] mb-1">Boost status</div>
        <div className="text-[#7b8794]">Active until 15/07/2026</div>
      </div>
      <div className="rounded-2xl bg-[#f7fbf9] px-6 py-5">
        <div className="font-bold text-[#1a2b3c] mb-1">Ranking benefit</div>
        <div className="text-[#7b8794]">Upgraded profiles appear higher than standard professionals in search and discovery lists.</div>
      </div>
    </div>
  );
}
