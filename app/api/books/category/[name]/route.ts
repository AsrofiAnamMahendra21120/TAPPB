
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> } 
) {
  try {
    // Ambil nama kategori dari params
    const { name } = await params; 

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Ubah nama kategori yang diterima (misal: 'anak-anak') menjadi format yang disimpan di DB (misal: 'Anak-anak')
    const categoryName = name.replace(/-/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Query ke Supabase
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', categoryName);

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: 'Gagal mengambil buku berdasarkan kategori' }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}