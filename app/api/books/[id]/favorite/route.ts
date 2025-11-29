import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Promise untuk Next.js 15
) {
  try {
    const { id } = await params; // Wajib await
    const { is_favorite } = await request.json(); // Ambil status true/false dari kiriman frontend

    // Update data di Supabase
    const { data, error } = await supabase
      .from('books')
      .update({ is_favorite: is_favorite })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}