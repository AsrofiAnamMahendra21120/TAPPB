'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditBukuPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Umum',
    rating: 0,
    image_url: '',
    description: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        
        if (data) {
          setFormData({
            title: data.title || '',
            author: data.author || '',
            publisher: data.publisher || '',
            category: data.category || 'Umum',
            rating: data.rating || 0,
            image_url: data.image_url || '',
            description: data.description || '',
          });
        }
      } catch (error) {
        console.error(error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/books/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Data buku berhasil diperbarui!');
        router.push(`/books/${params.id}`);
        router.refresh();
      } else {
        alert('Gagal update data.');
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Memuat data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => router.back()} aria-label="Kembali">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Edit Buku</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        
        {/* Judul Buku */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
          <input 
            id="title" // ID ini menyambung ke htmlFor di atas
            required 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
          />
        </div>

        {/* Penulis & Penerbit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
            <input 
              id="author"
              required 
              name="author" 
              value={formData.author} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
            />
          </div>
          <div>
            <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
            <input 
              id="publisher"
              name="publisher" 
              value={formData.publisher} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
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
              value={formData.category} 
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
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input 
              id="rating"
              name="rating" 
              type="number" 
              step="0.1" 
              max="5" 
              min="0" 
              value={formData.rating} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
            />
          </div>
        </div>

        {/* URL Gambar */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Link Gambar (URL)</label>
          <input 
            id="image_url"
            name="image_url" 
            value={formData.image_url} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea 
            id="description"
            name="description" 
            rows={5} 
            value={formData.description} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
          ></textarea>
        </div>

        {/* Tombol Simpan */}
        <button 
          type="submit" 
          disabled={saving} 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-300"
        >
          {saving ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  );
}