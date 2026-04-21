"use client";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dummyCart = [
  { id: 1, title: "Parent Support Workbook", price: 399, qty: 1, image: "/uploads/certificates/parent-support.png" },
  { id: 2, title: "ADHD Learning Bundle", price: 699, qty: 2, image: "/uploads/certificates/adhd-bundle.png" },
];

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const cart = dummyCart; // Replace with real cart state
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <button
        className="fixed top-6 right-6 z-40 bg-white rounded-full shadow-lg p-3 flex items-center gap-2 hover:bg-indigo-50 transition-colors"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">{cart.length}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Your Cart</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-indigo-500 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <span className="text-gray-500 text-sm">Qty: {item.qty}</span>
                    </div>
                    <span className="font-bold text-indigo-600">₹{item.price * item.qty}</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t flex flex-col gap-3">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow hover:scale-105 hover:shadow-md transition-colors">Checkout</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
