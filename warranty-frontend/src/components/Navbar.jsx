import React, { useState } from 'react';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ session, onLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      localStorage.clear();
      window.location.reload();
    }
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Shield className="w-8 h-8 text-blue-600 fill-blue-600/10" />
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">WarrantySync</span>
          </div>

          {/* Desktop Links - Centered */}
          {!session && (
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Theme Toggle (Desktop) */}
            <button 
              onClick={toggleTheme}
              className="hidden md:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">{session.user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={onLogin}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={onLogin}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Theme Toggle (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full right-4 mt-2 w-64 bg-white/97 dark:bg-slate-900/97 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 animate-fade-in z-50">
          <div className="flex flex-col gap-1 p-2">
            {!session ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100/50 dark:text-slate-200 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <button 
                  onClick={() => { onLogin(); setIsMenuOpen(false); }}
                  className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100/50 dark:text-slate-200 dark:hover:bg-slate-800/50 rounded-lg transition-colors text-left w-full"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Signed in as <span className="text-slate-900 dark:text-white block mt-1 normal-case">{session.user.email}</span>
                </div>
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
