'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Star, Trash2, Edit, BookOpen, Calendar, Building } from 'lucide-react';

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
}

export default function BookDetailPage() {
  // Menggunakan useParams untuk menangkap ID dari URL
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const bookId = params.id;

  // --- 1. FETCH DATA DETAIL BUKU ---
  useEffect(() => {
    async function fetchDetail() {
      if (!bookId) return;
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) throw new Error('Buku tidak ditemukan');
        
        const data: Book = await res.json();
        setBook(data);
        setIsFavorite(data.is_favorite); // Sinkronkan state favorit dengan database
      } catch (error) {
        console.error(error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [bookId]);

  // --- 2. FUNGSI TOGGLE FAVORIT (LOVE) ---
  const toggleFavorite = async () => {
    if (!bookId) return;

    // Optimistic UI: Ubah tampilan icon dulu biar terasa cepat
    const newState = !isFavorite;
    setIsFavorite(newState);

    try {
      await fetch(`/api/books/${bookId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: newState }),
      });
    } catch (error) {
      // Jika gagal, kembalikan ke status semula
      setIsFavorite(!newState);
      alert('Gagal update status favorit');
    }
  };

  // --- 3. FUNGSI HAPUS BUKU (DELETE) ---
  const handleDelete = async () => {
    // Konfirmasi dulu agar tidak terhapus tidak sengaja
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus buku "${book?.title}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("Buku berhasil dihapus!");
        router.push('/'); // Kembali ke Beranda
        router.refresh(); // Refresh agar buku hilang dari list
      } else {
        alert("Gagal menghapus buku dari database.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  // --- TAMPILAN LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-48 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN JIKA DATA KOSONG ---
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <p className="text-xl font-bold text-gray-400 mb-4">Buku tidak ditemukan 😔</p>
        <button onClick={() => router.push('/')} className="text-blue-600 underline">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // --- TAMPILAN UTAMA ---
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* HEADER GAMBAR BESAR */}
      <div className="relative h-96 bg-gray-800 w-full">
        {book.image_url ? (
          <img 
            src={book.image_url} 
            alt={book.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {/* Overlay Gradient supaya teks tombol terlihat jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40"></div>
        
        {/* TOMBOL-TOMBOL NAVIGASI DI ATAS */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          {/* Tombol Back */}
          <button 
            onClick={() => router.back()} 
            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition"
            aria-label="Kembali"
          >
            <ArrowLeft size={24} />
          </button>

          {/* Group Tombol Aksi Kanan */}
          <div className="flex gap-3">
            {/* Tombol Favorit */}
            <button 
              onClick={toggleFavorite}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-white text-red-500' : 'bg-black/30 text-white hover:bg-black/50'}`}
              aria-label="Favorit"
            >
              <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            {/* Tombol Edit */}
            <button 
              onClick={() => router.push(`/edit/${bookId}`)}
              className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-blue-600 transition"
              aria-label="Edit Buku"
            >
              <Edit size={22} />
            </button>

            {/* Tombol Hapus */}
            <button 
              onClick={handleDelete}
              className="bg-black/30 backdrop-blur-md p-2 rounded-full text-red-400 hover:bg-red-600 hover:text-white transition"
              aria-label="Hapus Buku"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* KARTU KONTEN DETAIL (Overlap ke atas) */}
      <div className="relative -mt-20 px-4 z-10">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          
          {/* Judul & Kategori */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-3/4">
               <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  {book.category}
               </span>
               <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                 {book.title}
               </h1>
               <p className="text-gray-500 text-sm mt-1">
                 oleh <span className="font-semibold text-blue-600">{book.author}</span>
               </p>
            </div>
            
            {/* Rating Box */}
            <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-100 shadow-sm">
               <Star size={20} className="text-yellow-500 fill-yellow-500 mb-1" />
               <span className="font-bold text-gray-800 text-lg">{book.rating}</span>
            </div>
          </div>

          <hr className="border-dashed border-gray-200 my-5" />

          {/* Info Grid (Penerbit & Tahun) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
               <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                 <Building size={18} />
               </div>
               <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Penerbit</p>
                 <p className="text-sm font-bold text-gray-700 truncate">{book.publisher}</p>
               </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
               <div className="bg-white p-2 rounded-full shadow-sm text-green-500">
                 <BookOpen size={18} />
               </div>
               <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">Kategori</p>
                 <p className="text-sm font-bold text-gray-700">{book.category}</p>
               </div>
            </div>
          </div>

          {/* Sinopsis */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
              Sinopsis
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              {book.description || "Belum ada deskripsi untuk buku ini."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}