
import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.025, boxShadow: "0 8px 32px rgba(80,80,180,0.13)" }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-lg flex flex-col transition-all duration-300 group hover:shadow-2xl hover:border-indigo-200 min-h-[420px]"
    >
      {/* Floating Discount Badge */}
      {product.discount && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-5 left-5 z-10 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold tracking-wide"
        >
          {product.discount}
        </motion.span>
      )}
      {/* Product Image */}
      <div className="flex items-center justify-center h-48 w-full bg-gradient-to-br from-indigo-50 to-blue-100 rounded-t-2xl overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.title}
          className="object-contain h-36 drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
          whileHover={{ scale: 1.13 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        />
      </div>
      {/* Card Content */}
      <div className="flex-1 flex flex-col px-6 py-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-indigo-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>
        {/* Price and Old Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-extrabold text-indigo-600">₹{product.price}</span>
          {product.oldPrice && (
            <span className="text-sm line-through text-gray-400">₹{product.oldPrice}</span>
          )}
        </div>
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-5 h-5 ${i < product.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold shadow hover:from-indigo-600 hover:to-blue-600 transition-colors"
          >
            Add to Cart
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-1 px-4 py-2 rounded-xl bg-white border border-indigo-400 text-indigo-600 font-bold shadow hover:bg-indigo-50 transition-colors"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
