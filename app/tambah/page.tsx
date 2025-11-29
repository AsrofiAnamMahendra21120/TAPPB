'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function TambahBukuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State untuk menyimpan input user
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Umum',
    rating: '',
    image_url: '',
    description: '',
  });

  // Fungsi saat mengetik di form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi saat tombol Simpan ditekan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Buku berhasil ditambahkan!');
        router.push('/'); // Pindah ke Beranda
        router.refresh(); // Refresh agar data baru muncul
      } else {
        const err = await res.json();
        alert('Gagal: ' + err.error);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Sticky */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => router.back()} aria-label="Kembali">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Tambah Buku Baru</h1>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku *</label>
          <input 
            required 
            name="title" 
            type="text" 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
            placeholder="Contoh: Laskar Pelangi" 
          />
        </div>

        {/* Grid 2 Kolom: Penulis & Penerbit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penulis *</label>
            <input 
              required 
              name="author" 
              type="text" 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
              placeholder="Nama Penulis" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
            <input 
              name="publisher" 
              type="text" 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
              placeholder="Nama Penerbit" 
            />
          </div>
        </div>

        {/* Grid 2 Kolom: Kategori & Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select 
                id="category"
                name="category" 
                aria-label="Kategori"
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
              >
                <option value="Umum">Umum</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Non-Fiksi">Non-Fiksi</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Anak-anak">Anak-anak</option>
              </select>
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
            <input 
              name="rating" 
              type="number" 
              step="0.1" 
              max="5" 
              min="0" 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
              placeholder="4.5" 
            />
          </div>
        </div>

        {/* URL Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar Cover (URL)</label>
          <input 
            name="image_url" 
            type="url" 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
            placeholder="https://images.unsplash.com/..." 
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis / Deskripsi</label>
          <textarea 
            name="description" 
            rows={4} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
            placeholder="Tulis ringkasan buku di sini..."
          ></textarea>
        </div>

        {/* Tombol Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-4 active:scale-95 disabled:bg-blue-300"
        >
          {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Buku</>}
        </button>

      </form>
    </div>
  );
}