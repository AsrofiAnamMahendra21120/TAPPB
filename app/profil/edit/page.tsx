'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function EditProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    email: ''
  });

  // Ambil data lama
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            bio: data.bio || '',
            email: data.email || ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      router.push('/profil'); // Balik ke halaman profil
      router.refresh();
    } catch (error) {
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center text-gray-400">Memuat data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-3 shadow-md sticky top-0 z-10">
        <button onClick={() => router.back()} aria-label="Kembali">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Edit Profil Saya</h1>
      </div>

      <div className="p-6 flex justify-center -mt-2 mb-4">
         <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
            <User size={40} className="text-blue-600" />
         </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-4">
        
        {/* Nama Lengkap */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input 
            id="full_name"
            name="full_name" 
            value={formData.full_name} 
            onChange={handleChange} 
            // Tambahkan text-gray-900 di sini
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>

        {/* Email */}
        <div>
           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
           <input 
             id="email"
             name="email" 
             value={formData.email} 
             onChange={handleChange} 
             // Tambahkan text-gray-900 di sini
             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
           />
        </div>

        {/* Nomor Telepon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
          <input 
            id="phone"
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            // Tambahkan text-gray-900 di sini
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio Singkat</label>
          <textarea 
            id="bio"
            name="bio" 
            rows={3} 
            value={formData.bio} 
            onChange={handleChange} 
            // Tambahkan text-gray-900 di sini
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={saving} 
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4 shadow-md flex justify-center gap-2 hover:bg-blue-700 transition disabled:bg-blue-300"
        >
           {saving ? 'Menyimpan...' : <><Save size={20} /> Simpan Profil</>}
        </button>
      </form>
    </div>
  );
}