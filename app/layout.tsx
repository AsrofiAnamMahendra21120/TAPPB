import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. IMPORT KOMPONEN BOTTOM NAV
// (Gunakan titik satu ./ jika folder components sejajar dengan layout.tsx)
import BottomNav from "./components/BottomNav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Katalog Buku PWA",
  description: "Aplikasi Perpustakaan Pribadi",
  manifest: "/manifest.json", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        
        {/* Konten Utama Halaman */}
        <main className="min-h-screen bg-gray-50 pb-20"> 
           {/* pb-20 ditambahkan agar konten paling bawah tidak tertutup navigasi */}
           {children}
        </main>
        
        {/* 2. PASANG KOMPONEN DI SINI (Di luar main, tapi di dalam body) */}
        <BottomNav />
        
      </body>
    </html>
  );
}