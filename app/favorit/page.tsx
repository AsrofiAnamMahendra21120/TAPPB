// app/favorit/page.tsx
'use client';
import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard'; // Pastikan path import ini benar (bisa pakai ./.. jika error)

// Kita definisikan ulang tipe datanya
interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  image_url: string;
  category: string;
  is_favorite: boolean;
}

export default function FavoritPage() {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        // 1. Panggil semua data buku
        const res = await fetch('/api/books');
        const data = await res.json();
        
        // 2. Filter hanya yang is_favorite = true
        if (Array.isArray(data)) {
          const favs = data.filter((book: Book) => book.is_favorite === true);
          setFavorites(favs);
        }
      } catch (error) {
        console.error('Gagal mengambil data favorit:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Biru */}
      <div className="bg-blue-600 p-6 shadow-md text-white mb-6">
        <h1 className="text-xl font-bold">Buku Favorit</h1>
        <p className="text-blue-100 text-sm">Koleksi buku yang Anda simpan</p>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center mt-10 text-gray-400">Memuat data...</p>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {favorites.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 opacity-60">
            <span className="text-6xl">💔</span>
            <p className="text-gray-500 mt-4 font-medium">Belum ada buku favorit.</p>
            <p className="text-xs text-gray-400">Tandai buku sebagai favorit di database.</p>
          </div>
        )}
      </div>
    </div>
  );
}