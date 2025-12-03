import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Zap, Bell } from 'lucide-react';

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none group">
      
      {/* Glow - Toned down for light mode */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl opacity-50 -z-10" />

      {/* Main Container - ADDED HOVER LIFT HERE */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden h-72 md:h-auto md:aspect-[16/10] 
                      transition-all duration-500 ease-out 
                      hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        
        {/* Header Bar - Light/Dark */}
        <div className="h-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 flex items-center px-4 gap-2 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <div className="hidden sm:block ml-4 h-4 w-32 bg-slate-200 dark:bg-slate-700/30 rounded-full" />
        </div>

        {/* Interface Content */}
        <div className="p-3 md:p-6 flex h-full gap-3 md:gap-6">
          
          {/* Sidebar */}
          <div className="hidden sm:flex w-16 flex-col gap-4 pt-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 flex items-center justify-center text-blue-600 dark:text-blue-500">
               <Shield className="w-4 h-4" />
            </div>
            {/* Sidebar Lines */}
            <div className="h-2 w-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="h-2 w-8 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-3 md:space-y-4">
            
            {/* Stats Row */}
            <div className="flex gap-3 md:gap-4">
              {/* Stat Card 1 */}
              <div className="h-16 md:h-24 flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3 space-y-2">
                 <div className="h-5 w-5 md:h-8 md:w-8 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
                    <Shield className="w-3 h-3 md:w-4 md:h-4" />
                 </div>
                 <div className="h-1.5 md:h-2 w-12 bg-slate-200 dark:bg-slate-700/50 rounded-full" />
              </div>
              {/* Stat Card 2 */}
              <div className="h-16 md:h-24 flex-1 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3 space-y-2">
                 <div className="h-5 w-5 md:h-8 md:w-8 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                    <Bell className="w-3 h-3 md:w-4 md:h-4" />
                 </div>
                 <div className="h-1.5 md:h-2 w-12 bg-slate-200 dark:bg-slate-700/50 rounded-full" />
              </div>
            </div>

            {/* Active Task Card */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="relative rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 md:p-4 overflow-hidden shadow-sm"
            >
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 opacity-70"
              />

              <div className="flex items-center gap-3 mb-2 md:mb-4">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                 </div>
                 <div className="space-y-1.5">
                    <div className="h-2 w-20 md:w-32 bg-slate-200 dark:bg-slate-600 rounded-full" />
                    <div className="h-1.5 w-12 md:w-20 bg-slate-100 dark:bg-slate-700 rounded-full" />
                 </div>
              </div>

              <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                 <div className="flex justify-between items-center">
                    <div className="h-1.5 w-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-1.5 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full animate-pulse" />
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="h-1.5 w-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="h-1.5 w-10 bg-blue-100 dark:bg-blue-500/20 rounded-full animate-pulse delay-75" />
                 </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Floating Notification */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 100, damping: 15 }}
          className="absolute bottom-3 right-3 md:bottom-6 md:right-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20"
        >
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Success</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Warranty Secured</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}