import React from 'react';
import HeroVisual from './HeroVisual'; // Make sure this path is correct

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative bg-white dark:bg-slate-900 transition-colors duration-200 overflow-hidden">
      {/* Subtle Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 opacity-70 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-36 md:pb-24 relative z-10">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          
          {/* Left Content (Text) */}
          <div className="flex flex-col items-start text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 animate-fade-in">
              New: AI-Powered Extraction ✨
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight animate-fade-in [animation-delay:100ms]">
              Never Lose Track of Your <span className="text-blue-600">Warranties</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg animate-fade-in [animation-delay:200ms]">
              Stop digging through shoe boxes. Upload your receipts, and let our AI organize them for you.
            </p>

            {/* CTA Button */}
            <div className="mb-8 animate-fade-in [animation-delay:300ms]">
              <button 
                onClick={onGetStarted}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started for Free
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 animate-fade-in [animation-delay:400ms]">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free tier available
              </div>
            </div>
          </div>

          {/* Right Content (The New Visual) */}
          <div className="w-full flex justify-center md:justify-end animate-fade-in [animation-delay:500ms]">
             {/* Replaced placeholder div with the HeroVisual component */}
             <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
}