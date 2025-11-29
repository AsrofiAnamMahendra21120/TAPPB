// app\components\BookCard.tsx
'use client';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface BookProps {
  id: number;
  title: string;
  author: string;
  publisher: string;
  rating: number;
  image_url: string;
  category: string;
}

export default function BookCard({ book }: { book: BookProps }) {
  return (
    <Link href={`/books/${book.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
        {/* Bagian Gambar / Placeholder */}
        <div className="h-32 bg-gray-100 flex items-center justify-center relative">
          {book.image_url ? (
            <img 
              src={book.image_url} 
              alt={book.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-4xl">📚</span>
          )}
          
          {/* Badge Rating */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <Star size={10} fill="white" />
            <span>{book.rating || '-'}</span>
          </div>
        </div>

        {/* Bagian Informasi Buku */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-1">{book.author}</p>
          <div className="mt-auto">
             <span className="inline-block bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
               {book.category || 'Umum'}
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
}