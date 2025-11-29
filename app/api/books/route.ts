import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- 1. FUNGSI GET (WAJIB ADA: Untuk Halaman Beranda & Search) ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = supabase.from('books').select('*');

    // Logic pencarian
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,publisher.ilike.%${search}%`);
    }

    // Urutkan dari yang terbaru
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- 2. FUNGSI POST (Untuk Halaman Tambah Buku) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input
    if (!body.title || !body.author) {
      return NextResponse.json({ error: 'Judul dan Penulis wajib diisi' }, { status: 400 });
    }

    // Insert ke Supabase
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title: body.title,
          author: body.author,
          publisher: body.publisher,
          category: body.category,
          description: body.description,
          rating: parseFloat(body.rating) || 0,
          image_url: body.image_url,
          is_favorite: false,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}