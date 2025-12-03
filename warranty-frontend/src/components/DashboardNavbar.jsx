import React, { useState, useRef, useEffect } from 'react';
import { Shield, LogOut, Sun, Moon, User } from 'lucide-react';
import { supabase } from '../supabase';
import { useTheme } from '../context/ThemeContext';

export default function DashboardNavbar({ session }) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/'; // Redirect to home
    } catch (error) {
      console.error('Error signing out:', error);
      localStorage.clear();
      window.location.reload();
    }
  };

  const userAvatarUrl = session?.user?.user_metadata?.avatar_url;
  const userEmail = session?.user?.email;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.location.href = '/dashboard'}
          >
            <Shield className="w-8 h-8 text-blue-600 fill-blue-600/10 group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">WarrantySync</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${isDropdownOpen ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                  {userAvatarUrl ? (
                    <img 
                      src={userAvatarUrl} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-fade-in overflow-hidden">
                  
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={userEmail}>
                      {userEmail}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="p-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
