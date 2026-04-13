"use client";
import React from "react";
import { ShoppingCart, Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: <Truck className="w-7 h-7 text-indigo-500" />, title: "Free Delivery", desc: "On all orders above ₹499" },
  { icon: <ShieldCheck className="w-7 h-7 text-indigo-500" />, title: "Secure Payment", desc: "100% secure payment" },
  { icon: <RefreshCw className="w-7 h-7 text-indigo-500" />, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: <Headphones className="w-7 h-7 text-indigo-500" />, title: "24/7 Support", desc: "We are here to help" },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((f, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center">
          <div className="mb-4">{f.icon}</div>
          <h4 className="text-lg font-semibold mb-2 text-gray-900">{f.title}</h4>
          <p className="text-gray-500 text-sm">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
