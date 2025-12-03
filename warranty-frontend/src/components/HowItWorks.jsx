import React from 'react';
import { motion } from 'framer-motion';

// --- CUSTOM ANIMATED ICONS ---
// Updated width/height props to be responsive (passed via className or style if needed, 
// but here we just rely on the parent container size to frame them visually).
// Actually, the SVGs are set to width="32" height="32". 
// We should make the SVG size responsive too: w-6 h-6 on mobile, w-8 h-8 on desktop.

const AnimatedUpload = ({ delay, color }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    // CHANGED: Removed fixed width="32". Now using Tailwind classes.
    className={`${color} w-6 h-6 md:w-8 md:h-8`} 
    initial="idle"
    whileInView="active"
    viewport={{ once: true, amount: 0.5 }}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <motion.path 
      d="M12 12v9" 
      variants={{
        idle: { y: 0 },
        active: { 
          y: [-3, 3, -3],
          transition: { delay: delay, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }
      }}
    />
    <motion.path 
      d="m16 16-4-4-4 4" 
      variants={{
        idle: { y: 0 },
        active: { 
          y: [-3, 3, -3],
          transition: { delay: delay, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }
      }}
    />
  </motion.svg>
);

const AnimatedScan = ({ delay, color }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`${color} w-6 h-6 md:w-8 md:h-8`}
    initial="idle"
    whileInView="active"
    viewport={{ once: true, amount: 0.5 }}
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <motion.path 
      d="M7 12h10" 
      variants={{
        idle: { opacity: 0.5, y: 0 },
        active: { 
          y: [ -4, 4, -4 ], opacity: [0.5, 1, 0.5],
          transition: { delay: delay, duration: 2, repeat: Infinity, ease: "linear" }
        }
      }}
    />
  </motion.svg>
);

const AnimatedBell = ({ delay, color }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`${color} w-6 h-6 md:w-8 md:h-8`}
    style={{ originX: '50%', originY: '0%' }}
    initial="idle"
    whileInView="active"
    viewport={{ once: true, amount: 0.5 }}
  >
    <motion.g
      style={{ originX: "50%", originY: "0%" }}
      variants={{
        idle: { rotate: 0 },
        active: { 
          rotate: [0, -25, 20, -15, 10, -5, 0], 
          transition: { delay: delay, duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }
        }
      }}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </motion.g>
  </motion.svg>
);

export default function HowItWorks() {
  const steps = [
    {
      IconComponent: AnimatedUpload,
      activeColor: 'text-blue-600',
      delay: 0,
      title: 'Upload Instantly',
      text: 'Snap a photo or drop a PDF. We handle the rest.',
    },
    {
      IconComponent: AnimatedScan,
      activeColor: 'text-purple-600',
      delay: 1.2,
      title: 'AI Extraction',
      text: 'Our engine automatically pulls dates, products, and serial numbers.',
    },
    {
      IconComponent: AnimatedBell,
      activeColor: 'text-emerald-600',
      delay: 2.4,
      title: 'Never Forget',
      text: 'Get timely reminders before your warranties expire.',
    },
  ];

  return (
    <section id="how-it-works" className="pt-16 pb-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            How it works
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* DESKTOP LINE (Unchanged) */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            <motion.div
              className="h-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, ease: "linear", delay: 0.2 }}
            />
          </div>

          {/* MOBILE LINE (Vertical) - ADJUSTED POSITION */}
          {/* Icon Width Mobile = 3.5rem (w-14)
             Center of Icon = 1.75rem
             Left Position = 1.75rem
          */}
          <div className="md:hidden absolute top-7 bottom-24 left-[1.75rem] w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full">
            <motion.div
              className="w-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, ease: "linear", delay: 0.2 }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0 relative z-10">
              
              {/* Icon Circle Wrapper - RESPONSIVE SIZE */}
              {/* Mobile: w-14 h-14 (Small) | Desktop: w-20 h-20 (Big) */}
              <motion.div
                className="shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 bg-white dark:bg-slate-900 transition-all duration-300"
                initial={{ borderColor: "rgba(226, 232, 240, 1)", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                whileInView={{ 
                  borderColor: index === 0 ? '#3b82f6' : index === 1 ? '#a855f7' : '#10b981',
                  boxShadow: index === 0 ? '0 0 20px rgba(59, 130, 246, 0.3)' 
                           : index === 1 ? '0 0 20px rgba(168, 85, 247, 0.3)' 
                           : '0 0 20px rgba(16, 185, 129, 0.3)'
                }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.2 }}
              >
                <step.IconComponent delay={step.delay} color={step.activeColor} />
              </motion.div>

              {/* Typography */}
              <motion.div
                className="text-left md:text-center pt-1 md:pt-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay + 0.2 }}
              >
                <h3 className="mt-0 md:mt-8 text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 md:mt-3 text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed text-sm md:text-base">
                  {step.text}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}