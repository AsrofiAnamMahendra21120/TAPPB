// app/kategori/page.tsx
'use client';

import Link from 'next/link';
import { BookOpen, Briefcase, Smile, Monitor, Layers } from 'lucide-react';

export default function KategoriPage() {
  // Daftar kategori statis (sesuaikan dengan screenshot kamu)
  const categories = [
    { name: 'Anak-anak', slug: 'anak-anak', icon: Smile, color: 'text-yellow-500' },
    { name: 'Bisnis', slug: 'bisnis', icon: Briefcase, color: 'text-brown-500' }, // Tailwind default gak ada brown, nti jadi default
    { name: 'Fiksi', slug: 'fiksi', icon: BookOpen, color: 'text-blue-500' },
    { name: 'Non-Fiksi', slug: 'non-fiksi', icon: Layers, color: 'text-green-500' },
    { name: 'Teknologi', slug: 'teknologi', icon: Monitor, color: 'text-purple-500' },
  ];

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      {/* Header Biru */}
      <div className="bg-blue-600 -mx-4 -mt-4 p-6 mb-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Kategori Buku</h1>
        <p className="text-blue-100 text-sm mt-1">Jelajahi buku berdasarkan topik favoritmu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={cat.slug} 
              href={`/kategori/${cat.slug}`}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-95"
            >
              <div className={`p-3 rounded-full bg-gray-50 ${cat.color}`}>
                <Icon size={32} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                <p className="text-xs text-gray-500">Lihat koleksi buku {cat.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}