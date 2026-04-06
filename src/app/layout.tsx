import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educate UI",
  description: "Education platform UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}