'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Pastikan import PlusSquare ada di sini
import { Home, Grid, Heart, User, Search, PlusSquare } from 'lucide-react'; 

export default function BottomNav() {
  const pathname = usePathname();

  // Daftar Menu Navigasi (Total 6 item)
  const navItems = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Cari', href: '/search', icon: Search },
    { name: 'Kategori', href: '/kategori', icon: Grid },
    { name: 'Favorit', href: '/favorit', icon: Heart },
    { name: 'Profil', href: '/profil', icon: User },
    { name: 'Tambah', href: '/tambah', icon: PlusSquare }, // Menu Baru
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      {/* Gunakan grid-cols-6 agar muat 6 tombol */}
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="inline-flex flex-col items-center justify-center px-1 hover:bg-gray-50 group"
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-[10px] truncate ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}