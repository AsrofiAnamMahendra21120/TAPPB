'use client';
import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import SkeletonCard from '../components/SkeletonCard'; // Import Skeleton

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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const handleSearch = async (searchTerm: string) => {
    setLoading(true); // Mulai loading (munculkan skeleton)
    try {
      const res = await fetch(`/api/books?search=${searchTerm}`);
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    } finally {
      setLoading(false); // Selesai loading (tampilkan data)
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-xl font-bold mb-4 text-blue-700">Pencarian Buku</h1>
      
      <input
        type="text"
        placeholder="Cari Judul, Pengarang, atau Penerbit..."
        className="w-full p-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-6 text-black"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />

      {/* LOGIKA SKELETON */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Tampilkan 6 kotak loading */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          {!loading && books.length === 0 && (
            <div className="text-center mt-20 opacity-50">
               <p className="text-4xl mb-2">🔍</p>
               <p>Tidak ditemukan buku.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}