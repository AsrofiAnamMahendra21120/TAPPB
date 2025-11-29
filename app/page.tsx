'use client';
import { useEffect, useState } from 'react';
import BookCard from './components/BookCard';
import SkeletonCard from './components/SkeletonCard'; // Import Skeleton
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  image_url: string;
  category: string;
  created_at: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   async function fetchBooks() {
      try {
        const res = await fetch('/api/books');
        
        // CEK DULU: Apakah response-nya OK?
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari server');
        }

        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error('Gagal ambil data:', error);
        // Opsional: Set books jadi array kosong biar gak crash
        setBooks([]); 
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const featuredBooks = books.filter((book) => book.rating >= 4.7);
  const recentBooks = [...books].reverse().slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Biru */}
      <div className="bg-blue-600 p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Katalog Buku Digital</h1>
        <p className="text-blue-100 text-sm mt-1">Jelajahi koleksi buku perpustakaan pribadi Anda</p>
      </div>

      <main className="p-4 space-y-8">
        
        {/* LOGIKA LOADING: Jika loading, tampilkan Skeleton. Jika tidak, tampilkan konten asli */}
        {loading ? (
          <>
            {/* Skeleton untuk Bagian Atas */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex gap-4 overflow-hidden">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="min-w-[160px] w-[160px]">
                     <SkeletonCard />
                   </div>
                 ))}
              </div>
            </div>
            
            {/* Skeleton untuk Bagian Bawah */}
            <div className="space-y-4 mt-8">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* KONTEN ASLI: Buku Pilihan */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Buku Pilihan</h2>
                <Link href="/search" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {featuredBooks.map((book) => (
                  <div key={book.id} className="min-w-[160px] w-[160px]">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </section>

            {/* KONTEN ASLI: Buku Terbaru */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Buku Terbaru</h2>
                <Link href="/search" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recentBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}