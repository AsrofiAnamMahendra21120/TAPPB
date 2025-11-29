'use client';
import { useEffect, useState } from 'react';
import BookCard from './components/BookCard';
import SkeletonCard from './components/SkeletonCard';
import Link from 'next/link';
// Import icon WifiOff untuk penanda offline
import { WifiOff } from 'lucide-react'; 

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
  const [isOffline, setIsOffline] = useState(false); // State untuk deteksi offline

  useEffect(() => {
    async function fetchBooks() {
      try {
        // 1. Coba ambil data dari API (Internet)
        const res = await fetch('/api/books');
        
        if (!res.ok) throw new Error('Gagal fetch');
        
        const data = await res.json();
        setBooks(data);
        
        // 2. Jika berhasil, SIMPAN ke LocalStorage sebagai cadangan
        localStorage.setItem('offline_books', JSON.stringify(data));
        setIsOffline(false);

      } catch (error) {
        console.log('Mode Offline aktif, mengambil cache...');
        setIsOffline(true);

        // 3. Jika Error (Offline), AMBIL dari LocalStorage
        const cachedData = localStorage.getItem('offline_books');
        if (cachedData) {
          setBooks(JSON.parse(cachedData));
        }
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
      <div className="bg-blue-600 p-6 text-white shadow-md relative">
        <h1 className="text-2xl font-bold">Katalog Buku Digital</h1>
        <p className="text-blue-100 text-sm mt-1">Jelajahi koleksi buku perpustakaan pribadi Anda</p>
        
        {/* Indikator Offline (Muncul jika internet mati) */}
        {isOffline && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse">
            <WifiOff size={14} /> Offline Mode
          </div>
        )}
      </div>

      <main className="p-4 space-y-8">
        {loading ? (
          /* ... Kode Skeleton Loading biarkan sama seperti sebelumnya ... */
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Bagian Buku Pilihan & Terbaru biarkan sama ... */}
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

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Buku Terbaru</h2>
                <Link href="/search" className="text-xs text-blue-600 font-medium">Lihat Semua</Link>
              </div>
              
              {/* Pesan jika offline & tidak ada cache */}
              {isOffline && books.length === 0 && (
                <div className="text-center p-10 text-gray-400">
                  <WifiOff className="mx-auto mb-2" size={32} />
                  <p>Anda sedang offline dan belum ada data tersimpan.</p>
                </div>
              )}

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