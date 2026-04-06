"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, LogOut, User } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between bg-white fixed top-0 z-50 shadow-sm">
      
      <Link href="/" className="text-xl md:text-2xl font-bold text-green-600">
        EducateX
      </Link>

      <nav className="hidden lg:flex gap-6 text-gray-700">
        <Link href="/" className="hover:text-green-600 transition">Home</Link>
        <Link href="#about" className="hover:text-green-600 transition">About</Link>
        <Link href="#features" className="hover:text-green-600 transition">Pages</Link>
        <Link href="#courses" className="hover:text-green-600 transition">Courses</Link>
        <Link href="#" className="hover:text-green-600 transition">Shop</Link>
        <Link href="#" className="hover:text-green-600 transition">Blog</Link>
        <Link href="#" className="hover:text-green-600 transition">Contact</Link>
      </nav>

      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 cursor-pointer hover:text-green-600 transition" />
        <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-600 transition" />

        {session?.user ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">{session.user.name || "User"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden md:block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm transition"
            >
              LOGIN
            </Link>
            <Link
              href="/login"
              className="md:hidden bg-green-500 text-white px-3 py-2 rounded-full text-sm"
            >
              LOGIN
            </Link>
          </>
        )}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

    </header>
  );
};

export default Navbar;