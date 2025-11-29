'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function TambahBukuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Umum',
    rating: '',
    image_url: '',
    read_url: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Buku berhasil ditambahkan!');
        router.push('/');
        router.refresh();
      } else {
        alert('Gagal menambah buku.');
      }
    } catch (error) {
      alert('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => router.back()} aria-label="Kembali ke halaman sebelumnya">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Tambah Buku Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        
        {/* Judul Buku */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Buku *</label>
          <input 
            id="title"
            required 
            name="title" 
            onChange={handleChange} 
            // Tambahkan text-gray-900
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>

        {/* Penulis & Penerbit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Penulis *</label>
            <input 
              id="author"
              required 
              name="author" 
              onChange={handleChange} 
              // Tambahkan text-gray-900
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
            />
          </div>
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
            <input 
              id="publisher"
              name="publisher" 
              onChange={handleChange} 
              // Tambahkan text-gray-900
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
            />
          </div>
        </div>

        {/* Kategori & Rating */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              id="category"
              name="category" 
              onChange={handleChange} 
              // Tambahkan text-gray-900
              className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
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
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input 
              id="rating"
              name="rating" 
              type="number" 
              step="0.1" 
              max="5" 
              onChange={handleChange} 
              // Tambahkan text-gray-900
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
            />
          </div>
        </div>

        {/* Link Baca (PDF) */}
        <div>
          <label htmlFor="read_url" className="block text-sm font-medium text-gray-700 mb-1">Link Baca (PDF/Drive)</label>
          <input 
            id="read_url"
            name="read_url" 
            type="url" 
            onChange={handleChange} 
            // Tambahkan text-gray-900
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
            placeholder="https://..." 
          />
        </div>

        {/* Link Gambar */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Link Gambar Cover</label>
          <input 
            id="image_url"
            name="image_url" 
            type="url" 
            onChange={handleChange} 
            // Tambahkan text-gray-900
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>

        {/* Sinopsis */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea 
            id="description"
            name="description" 
            rows={4} 
            onChange={handleChange} 
            // Tambahkan text-gray-900
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 shadow-md flex justify-center gap-2 hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Buku</>}
        </button>

      </form>
    </div>
  );
}