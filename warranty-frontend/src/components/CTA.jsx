import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA({ onGetStarted }) {
  return (
    // FIX: Changed background to adapt (slate-50 for light, slate-900 for dark)
    <section className="relative py-17 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Background Pattern - Adaptive Opacity */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        
        {/* Headline - Adaptive Text Color */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
        >
          Ready to get <span className="text-blue-600 dark:text-blue-500">organized?</span>
        </motion.h2>

        {/* Subtext - Adaptive Text Color */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          Join thousands of users who trust WarrantySync to protect their purchases. 
          Start tracking for free today.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button 
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-sm text-slate-500 dark:text-slate-500"
        >
          No credit card required · Cancel anytime
        </motion.p>

      </div>
    </section>
  );
}