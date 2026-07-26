'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] flex flex-col transition-colors duration-300">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-8xl font-extrabold bg-gradient-to-r from-[#4F46E5] to-[#0EA5E9] bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#4F46E5] hover:bg-[#3F37C9] text-white text-sm font-semibold rounded-xl shadow-soft transition-all duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
