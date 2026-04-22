"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Signup is now handled on the login page with toggle animation
export default function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?register=1");
  }, [router]);
  return null;
}
