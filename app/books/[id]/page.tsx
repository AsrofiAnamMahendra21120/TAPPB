'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Star, Trash2, Edit, Building, BookOpen } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  image_url: string;
  category: string;
  description: string;
  is_favorite: boolean;
  read_url: string; 
}

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const bookId = params.id;

  // 1. Fetch Data
  useEffect(() => {
    async function fetchDetail() {
      if (!bookId) return;
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) throw new Error('Error');
        const data = await res.json();
        setBook(data);
        setIsFavorite(data.is_favorite);
      } catch (error) {
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [bookId]);

  // 2. Toggle Favorit
  const toggleFavorite = async () => {
    if (!bookId) return;
    const newState = !isFavorite;
    setIsFavorite(newState);
    try {
      await fetch(`/api/books/${bookId}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ is_favorite: newState }),
      });
    } catch (e) { setIsFavorite(!newState); }
  };

  // 3. Hapus Buku
  const handleDelete = async () => {
    if (confirm('Yakin hapus buku ini?')) {
      await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
      router.push('/');
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-900">Memuat...</div>;
  if (!book) return <div className="p-10 text-center text-gray-900">Buku tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Gambar Header */}
      <div className="relative h-96 bg-gray-800 w-full">
        {book.image_url && <img src={book.image_url} alt={book.title} className="w-full h-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        {/* TOMBOL NAVIGASI ATAS */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          
          {/* Tombol Back */}
          <button 
            onClick={() => router.back()} 
            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white"
            aria-label="Kembali"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex gap-3">
            {/* Tombol Favorit */}
            <button 
              onClick={toggleFavorite} 
              className={`p-2 rounded-full backdrop-blur-md ${isFavorite ? 'bg-white text-red-500' : 'bg-black/30 text-white'}`}
              aria-label={isFavorite ? "Hapus Favorit" : "Tambah Favorit"}
            >
              <Heart size={22} fill={isFavorite?"currentColor":"none"} />
            </button>

            {/* Tombol Edit */}
            <button 
              onClick={() => router.push(`/edit/${bookId}`)} 
              className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white"
              aria-label="Edit Buku"
            >
              <Edit size={22} />
            </button>

            {/* Tombol Hapus */}
            <button 
              onClick={handleDelete} 
              className="bg-black/30 backdrop-blur-md p-2 rounded-full text-red-400"
              aria-label="Hapus Buku"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Konten Detail */}
      <div className="relative -mt-20 px-4 z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block">{book.category}</span>
          
          {/* JUDUL - HITAM PEKAT */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{book.title}</h1>
          
          {/* PENULIS - ABU GELAP */}
          <p className="text-gray-700 text-sm font-medium">oleh {book.author}</p>
          
          <div className="flex items-center gap-1 mt-2 mb-4">
             <Star className="text-yellow-500 fill-yellow-500" size={18} /> 
             {/* RATING - HITAM PEKAT */}
             <span className="font-bold text-gray-900">{book.rating}</span>
          </div>

          <h3 className="font-bold text-gray-900 mb-2">Sinopsis</h3>
          {/* DESKRIPSI - HITAM AGAK GELAP */}
          <p className="text-gray-800 text-sm mb-6 leading-relaxed">{book.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             <div className="bg-gray-100 p-3 rounded-xl border border-gray-200">
               <p className="text-gray-500 text-xs font-bold uppercase">Penerbit</p>
               {/* PENERBIT - HITAM */}
               <p className="font-bold text-gray-900">{book.publisher}</p>
             </div>
             <div className="bg-gray-100 p-3 rounded-xl border border-gray-200">
               <p className="text-gray-500 text-xs font-bold uppercase">Tahun</p>
               {/* TAHUN - HITAM */}
               <p className="font-bold text-gray-900">2023</p>
             </div>
          </div>

          {/* TOMBOL BACA BUKU */}
          {book.read_url && (
            <a 
              href={book.read_url} 
              target="_blank" 
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              <BookOpen size={20} /> Baca Buku Sekarang
            </a>
          )}
        </div>
      </div>
    </div>
  );
}