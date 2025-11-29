// app/kategori/[name]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BookCard from '../../components/BookCard';
import { ArrowLeft } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  image_url: string;
  category: string;
}

export default function CategoryResultPage() {
  const params = useParams(); // Ambil nama kategori dari URL
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil nama kategori (misal: "bisnis")
  const categoryName = params.name as string;
  
  // Ubah jadi Huruf Besar utk judul (bisnis -> Bisnis)
  const displayTitle = categoryName 
    ? categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : 'Kategori';

  useEffect(() => {
    async function fetchBooksByCategory() {
      try {
        // Panggil API yang sudah kamu tes tadi
        const res = await fetch(`/api/books/category/${categoryName}`);
        const data = await res.json();
        
        // Cek jika response berupa array, baru simpan
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Gagal ambil data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryName) {
      fetchBooksByCategory();
    }
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Simple dengan Tombol Back */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="Kembali">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Kategori: {displayTitle}</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center mt-10 text-gray-500">Memuat buku...</p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-4xl mb-2">📂</p>
            <p className="text-gray-500">Belum ada buku di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}