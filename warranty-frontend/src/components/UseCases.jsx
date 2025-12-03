import React from 'react';
import { motion } from 'framer-motion';

// --- CUSTOM ANIMATED ICONS (Unchanged) ---
const AnimatedLaptop = () => (
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M2 20h20" />
    <path d="M12 17v3" />
    <motion.rect 
      x="3" y="4" width="18" height="12" rx="2" 
      variants={{
        active: { scaleY: 1, y: 0, fill: "rgba(59, 130, 246, 0.2)" },
        initial: { scaleY: 0.8, y: 2, fill: "rgba(59, 130, 246, 0)" }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  </motion.svg>
);

const AnimatedHome = () => (
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <motion.path 
      d="M10 2l4 0"
      strokeLinecap="round"
      variants={{
        active: { opacity: 1, y: -2, scale: 1 },
        initial: { opacity: 0, y: 0, scale: 0.5 }
      }}
      transition={{ duration: 0.3 }}
    />
    <motion.path 
      d="M8.5 2c0-2 7-2 7 0"
      variants={{
        active: { opacity: 1, scale: 1.2, y: -3 },
        initial: { opacity: 0, scale: 0.8, y: 0 }
      }}
      transition={{ duration: 0.4, delay: 0.1 }}
    />
  </motion.svg>
);

const AnimatedBriefcase = () => (
  <motion.svg 
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <motion.path 
      d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" 
      variants={{
        active: { y: -3 },
        initial: { y: 0 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    />
  </motion.svg>
);

// --- MAIN COMPONENT ---

const cases = [
  {
    icon: AnimatedLaptop,
    title: "Personal Electronics",
    text: "Track insurance and warranty dates for your phone, laptop, and camera gear."
  },
  {
    icon: AnimatedHome,
    title: "Home Appliances",
    text: "Never dig through a file cabinet for a fridge or HVAC manual again."
  },
  {
    icon: AnimatedBriefcase,
    title: "Small Business",
    text: "Organize office assets and simplify tax season with instant receipt exports."
  }
];

// Entry Animation (Fade In)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const entryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

// Interaction Animation (Lift & Glow)
const cardInteractionVariants = {
  initial: { 
    y: 0, 
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" 
  },
  active: { 
    y: -8, 
    boxShadow: "0 25px 50px -12px rgba(59,130,246,0.25)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const glowVariants = {
  initial: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 0.2 } }
};

export default function UseCases() {
  return (
    <section className="py-17 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Built for everything you buy.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From gadgets to garage tools, if it has a warranty, we track it.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {cases.map((item, index) => (
            <motion.div
              key={index}
              className="relative group h-full"
              variants={entryVariants} // Handles the "Fade In" on scroll
            >
              <motion.div
                className="relative h-full"
                initial="initial"
                whileHover="active"  // Desktop: Lift when mouse over
                whileTap="active"    // Mobile: Lift when finger touches
              >
                {/* Back Glow Layer */}
                <motion.div 
                  variants={glowVariants}
                  className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10" 
                />
                
                {/* Card Content */}
                <motion.div 
                  variants={cardInteractionVariants}
                  className="relative h-full p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                    <item.icon />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}