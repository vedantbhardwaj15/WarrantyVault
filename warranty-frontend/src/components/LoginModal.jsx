import React from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 text-center" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 mt-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Join WarrantySync
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Get started instantly. No password required.
          </p>
        </div>

        {/* Google Button */}
        <button 
          onClick={onLogin}
          // FIX IS HERE: Added 'dark:hover:bg-slate-800' (or 700) to override the white hover
          className="group w-full flex items-center justify-center gap-3 px-4 py-3 
                     bg-white dark:bg-slate-900 
                     border border-slate-200 dark:border-slate-700 
                     rounded-xl shadow-sm 
                     hover:shadow-md 
                     hover:bg-slate-50 
                     dark:hover:bg-slate-800  
                     transition-all duration-200 mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" className="transition-transform group-hover:scale-110">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
            Continue with Google
          </span>
        </button>

        {/* Footer Text */}
        <p className="text-xs text-slate-500 dark:text-slate-500 px-4">
          By continuing, you agree to our <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-300">Terms</a> and <a href="#" className="underline hover:text-slate-800 dark:hover:text-slate-300">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}