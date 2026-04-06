"use client";

import "./globals.css";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}