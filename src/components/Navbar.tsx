"use client";

import { Menu, Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between bg-white fixed top-0 z-50 shadow-sm">
      
      <div className="text-xl md:text-2xl font-bold text-green-600">
        EducateX
      </div>

      <nav className="hidden lg:flex gap-6 text-gray-700">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Pages</a>
        <a href="#">Courses</a>
        <a href="#">Shop</a>
        <a href="#">Blog</a>
        <a href="#">Contact</a>
      </nav>

      <div className="flex items-center gap-3">
        <Search className="w-5 h-5" />
        <ShoppingCart className="w-5 h-5" />

        <button className="hidden md:block bg-green-500 text-white px-4 py-2 rounded-full text-sm">
          FREE TRIAL →
        </button>

        <Menu className="lg:hidden" />
      </div>

    </header>
  );
};

export default Navbar;