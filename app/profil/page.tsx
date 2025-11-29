'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Edit } from 'lucide-react';

interface Book {
  id: number;
  is_favorite: boolean;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
}

export default function ProfilPage() {
  const router = useRouter();
  
  // State Data Profil
  const [profile, setProfile] = useState<UserProfile>({
    full_name: 'Memuat...',
    email: '...',
    phone: '...',
    bio: '...'
  });

  // State Statistik
  const [stats, setStats] = useState({ totalBooks: 0, totalFavorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Ambil Data Profil dari Database
        const resProfile = await fetch('/api/profile');
        const dataProfile = await resProfile.json();
        if (dataProfile) setProfile(dataProfile);

        // 2. Ambil Data Statistik Buku
        const resBooks = await fetch('/api/books');
        const dataBooks = await resBooks.json();

        if (Array.isArray(dataBooks)) {
          const total = dataBooks.length;
          const favorites = dataBooks.filter((book: Book) => book.is_favorite === true).length;
          setStats({ totalBooks: total, totalFavorites: favorites });
        }
      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Profil Biru Besar */}
      <div className="bg-blue-600 pb-10 pt-6 px-6 text-white rounded-b-[2.5rem] shadow-lg relative">
        <div className="flex flex-col items-center">
          {/* Avatar Bulat */}
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border-4 border-white/30">
            <User size={40} className="text-white" />
          </div>
          
          {/* NAMA DINAMIS DARI DATABASE */}
          <h2 className="text-xl font-bold text-center px-4">{profile.full_name}</h2>
          <p className="text-blue-100 text-sm mb-4">{profile.email}</p>

          {/* TOMBOL EDIT (Sekarang Berfungsi!) */}
          <button 
            onClick={() => router.push('/profil/edit')}
            className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 transition flex items-center gap-2"
          >
            <Edit size={12} /> Edit Profil
          </button>
        </div>
      </div>

      {/* Bagian Form Info (READ ONLY) */}
      <div className="px-5 -mt-6">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-medium">Nama Lengkap</label>
            <p className="text-gray-800 font-semibold border-b pb-2 border-gray-100">{profile.full_name}</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium">Nomor Telepon</label>
            <p className="text-gray-800 font-semibold border-b pb-2 border-gray-100">{profile.phone}</p>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium">Bio</label>
            <p className="text-gray-800 font-semibold text-sm leading-relaxed">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Menu Statistik */}
      <div className="px-5 mt-4 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm ml-1">Statistik Perpustakaan</h3>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
           <span className="text-gray-600 text-sm">Total Buku Koleksi</span>
           <span className="font-bold text-blue-600 text-lg">
             {loading ? '...' : stats.totalBooks}
           </span>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
           <span className="text-gray-600 text-sm">Buku di Favorit</span>
           <span className="font-bold text-pink-500 text-lg">
             {loading ? '...' : stats.totalFavorites}
           </span>
        </div>

        {/* TOMBOL KELUAR SUDAH DIHAPUS SESUAI PERMINTAAN */}
        
        <p className="text-center text-xs text-gray-400 mt-8">
          Versi 1.0.0 • Dibuat dengan Next.js + Supabase
        </p>
      </div>
    </div>
  );
}