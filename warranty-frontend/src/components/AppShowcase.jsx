import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Bell, Download } from "lucide-react";

// --- Sub-Component: The Animated Stack ---
const NotificationStack = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const notifications = [
    {
      id: 1,
      icon: <Bell className="w-5 h-5" />,
      title: "Expiration Alerts",
      desc: "Get notified via Email & Push",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: 2,
      icon: <Download className="w-5 h-5" />,
      title: "Instant Export",
      desc: "Download receipts as PDF/JPG",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 w-full mt-4">
      {notifications.map((note, index) => {
        const isActive = index === activeIndex;
        return (
          <motion.div
            key={note.id}
            initial={false}
            animate={{
              y: isActive ? 0 : 10,
              scale: isActive ? 1 : 0.98,
              zIndex: isActive ? 10 : 0,
              opacity: isActive ? 1 : 0.4,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className={`p-2 rounded-lg ${note.bg} ${note.color}`}>
              {note.icon}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {note.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {note.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Main Component ---
export default function AppShowcase() {
  return (
    <section id="features" className="py-17 bg-slate-50 dark:bg-slate-900/50 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* --- ROW 1: Dashboard (Text Left, Image Right) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:justify-self-end max-w-lg w-full"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Real-time Tracking
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              All your assets.<br />One secure vault.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Stop guessing. See exactly how many days are left on your laptop,
              fridge, or car warranty instantly.
            </p>
            <ul className="space-y-4">
              {["Visual Countdown", "Search by Serial Number", "Dark Mode included"].map(
                (item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    {item}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Browser Window 1 (Dashboard) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group lg:justify-self-start w-full max-w-xl"
          >
            <div className="absolute -inset-1 bg-blue-500/20 blur-xl -z-10 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* FIXED CONTAINER COLORS */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
              
              {/* FIXED BROWSER HEADER */}
              <div className="h-8 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              {/* Dashboard Images */}
              <div className="bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                <img 
                  src="/screenshots/dashboard-light.png" 
                  alt="Dashboard Light" 
                  className="w-full h-auto block dark:hidden"
                />
                <img 
                  src="/screenshots/dashboard-dark.png" 
                  alt="Dashboard Dark" 
                  className="w-full h-auto hidden dark:block"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- ROW 2: Detail View (Image Left, Text Right) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Browser Window 2 (Detail View) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-last lg:order-first relative group lg:justify-self-end w-full max-w-xl"
          >
            <div className="absolute -inset-1 bg-purple-500/20 blur-xl -z-10 transition-opacity duration-500 group-hover:opacity-100" />
            
            {/* FIXED CONTAINER COLORS */}
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
              
              {/* FIXED BROWSER HEADER */}
              <div className="h-8 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              
              {/* Detail View Images */}
              <div className="bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
                <img 
                  src="/screenshots/details-light.png" 
                  alt="Details Light" 
                  className="w-full h-auto block dark:hidden transform scale-105"
                />
                <img 
                  src="/screenshots/details-dark.png" 
                  alt="Details Dark" 
                  className="w-full h-auto hidden dark:block transform scale-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content + Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 lg:justify-self-start max-w-lg w-full"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium">
              Proactive Alerts
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Never miss a<br />claim window.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              We notify you 30 days before expiration. Filing a claim? Download
              your original receipt in one click.
            </p>
            
            {/* Animated Stack */}
            <NotificationStack />
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}