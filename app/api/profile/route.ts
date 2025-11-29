import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Ambil data profil (Kita ambil ID 1 karena ini single user)
export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1) // Ambil 1 baris saja
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT: Update data profil
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Update data di baris pertama (ID 1 atau ID berapapun yang ditemukan)
    // Karena single user, kita bisa logic update ID=1
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        bio: body.bio,
        email: body.email
      })
      .eq('id', 1) // Asumsi ID 1 adalah pemilik
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update profil' }, { status: 500 });
  }
}