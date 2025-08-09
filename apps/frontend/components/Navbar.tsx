'use client';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Home, Compass, PlusSquare, MessageCircle, Bell } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/50 border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <Link href="/" className="font-bold text-xl">Snapzy</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-brand flex items-center gap-1"><Home size={18}/> <span className="hidden sm:inline">Home</span></Link>
          <Link href="/explore" className="hover:text-brand flex items-center gap-1"><Compass size={18}/> <span className="hidden sm:inline">Explore</span></Link>
          <Link href="/upload" className="hover:text-brand flex items-center gap-1"><PlusSquare size={18}/> <span className="hidden sm:inline">Upload</span></Link>
          <Link href="/messages" className="hover:text-brand flex items-center gap-1"><MessageCircle size={18}/> <span className="hidden sm:inline">Messages</span></Link>
          <Link href="/notifications" className="hover:text-brand flex items-center gap-1"><Bell size={18}/> <span className="hidden sm:inline">Alerts</span></Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}