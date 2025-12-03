import React from 'react';
import { Shield, Twitter, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Brand & Copyright */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              WarrantySync
            </span>
          </div>
          <span className="hidden md:block h-4 w-px bg-slate-300 dark:bg-slate-700"></span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear}
          </p>
        </div>

        {/* Right Side: Links & Socials */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {/* Legal Links */}
          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}