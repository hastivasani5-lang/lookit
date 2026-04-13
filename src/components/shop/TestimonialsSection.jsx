"use client";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aarav S.",
    avatar: "/uploads/certificates/parent-support.png",
    review: "Amazing quality and fast delivery! Highly recommend this shop for parents.",
  },
  {
    name: "Priya M.",
    avatar: "/uploads/certificates/adhd-bundle.png",
    review: "The ADHD bundle was a game changer for my child. Great support!",
  },
  {
    name: "Rahul T.",
    avatar: "/uploads/certificates/dyslexia-kit.png",
    review: "Loved the dyslexia kit. Very helpful and easy to use.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">What Our Customers Say</h2>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="min-w-[320px] bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center"
          >
            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-4 object-cover" />
            <p className="text-gray-600 mb-3">{t.review}</p>
            <span className="font-semibold text-indigo-600">{t.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
