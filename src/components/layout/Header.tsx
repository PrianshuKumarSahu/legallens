'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import DemoLoginButton from '@/components/common/DemoLoginButton';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <Scale className="h-6 w-6 text-indigo-400" aria-hidden="true" />
          <span className="font-bold text-xl tracking-tight">LegalLens</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/document/upload" className="text-slate-300 hover:text-white transition-colors">Upload</Link>
          <Link href="/compare" className="text-slate-300 hover:text-white transition-colors">Compare</Link>
        </nav>

        {/* User Menu */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                  <UserIcon className="h-4 w-4" />
                </div>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <DemoLoginButton variant="nav" label="⚡ Demo Access" />
              <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium">Log in</Link>
              <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 pb-4 pt-2 px-4 space-y-1 shadow-lg">
          <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
          <Link href="/document/upload" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Upload</Link>
          <Link href="/compare" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Compare</Link>
          
          <div className="pt-4 pb-2 border-t border-slate-800 mt-4">
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-400 truncate">{user.email}</div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2.5 mt-2 px-3">
                <DemoLoginButton className="w-full py-2.5 text-sm" label="⚡ Instant Demo Access" />
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1 text-center text-slate-300 hover:text-white px-3 py-2 border border-slate-700 rounded-md text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                  <Link href="/signup" className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
