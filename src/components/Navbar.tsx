"use client";

import { Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-sm">

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Image src="/leaf.png" alt="logo" width={35} height={35} className="h-auto w-auto" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Educate<span className="text-primary">X</span>
          </h1>
        </div>

        {/* MENU */}
        <nav className="hidden lg:flex items-center gap-8 text-gray-700 text-sm font-medium">
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/pages" className="hover:text-primary transition">Pages</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          <Link href="/shop" className="hover:text-primary transition">Shop</Link>
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <Search className="w-4 h-4 text-gray-700" />
          </div>

          {/* CART */}
          <div className="relative w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
            <ShoppingCart className="w-4 h-4 text-gray-700" />

            {/* BADGE */}
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <Link href="/login" className="hidden md:flex items-center gap-2 bg-[#1ec28e] hover:bg-[#18ab7d] text-white px-5 py-2 rounded-full text-sm font-medium transition"/>
          <Link href="/login" className="hidden md:flex items-center gap-2 bg-primary hover:bg-[#18ab7d] text-white px-5 py-2 rounded-full text-sm font-medium transition">
            LOGIN →
          </Link>

          {/* MOBILE MENU */}
          <Menu className="lg:hidden w-6 h-6 cursor-pointer" />

        </div>
      </div>

    </header>
  );
};

export default Navbar;