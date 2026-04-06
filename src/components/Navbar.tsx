"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between bg-white fixed top-0 z-50 shadow-sm">
      
      <Link href="/" className="text-xl md:text-2xl font-bold text-green-600">
        EducateX
      </Link>

      <nav className="hidden lg:flex gap-6 text-gray-700">
        <Link href="/" className="hover:text-green-600 transition">Home</Link>
        <a href="#about" className="hover:text-green-600 transition">About</a>
        <a href="#features" className="hover:text-green-600 transition">Pages</a>
        <a href="#courses" className="hover:text-green-600 transition">Courses</a>
        <a href="#" className="hover:text-green-600 transition">Shop</a>
        <a href="#" className="hover:text-green-600 transition">Blog</a>
        <a href="#" className="hover:text-green-600 transition">Contact</a>
      </nav>

      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 cursor-pointer" />
        <ShoppingCart className="w-5 h-5 cursor-pointer" />

        <Link 
          href="/login"
          className="hidden md:block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm transition"
        >
          LOGIN
        </Link>

        <Link 
          href="/signup"
          className="hidden md:block bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold px-4 py-2 rounded-full text-sm transition"
        >
          SIGN UP
        </Link>

        <Menu className="lg:hidden" />
      </div>

    </header>
  );
};

export default Navbar;