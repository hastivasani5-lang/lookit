"use client";
 
import { useEffect, useState } from "react";
 
import AdminLoginView from "@/components/admin/AdminLoginView";
 
export default function AdminLoginViewClient() {
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  if (!mounted) {
    return <main className="min-h-screen bg-[#eef0fb] px-4 py-8 md:px-8 md:py-12" />;
  }
 
  return <AdminLoginView />;
}
 