import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Sparkles, CheckCircle, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function AddWarrantyModal({ isOpen, onClose, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  // States: 'idle', 'uploading', 'analyzing', 'success', 'error'
  const [uploadState, setUploadState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadState('idle');
      setErrorMessage(null);
    }
  };

  const handleUploadClick = () => {
    if (uploadState !== 'uploading' && uploadState !== 'analyzing') {
      fileInputRef.current?.click();
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    try {
      // 1. Initial State
      setUploadState('uploading');
      setErrorMessage(null);

      // 2. Visual Trick: Switch to "Analyzing" after 2 seconds
      // We use a promise here so we can await it, but we don't block the actual upload request
      // We'll race them or just let the visual update happen independently
      const visualDelay = new Promise(resolve => setTimeout(() => {
        setUploadState(prev => prev === 'uploading' ? 'analyzing' : prev);
        resolve();
      }, 2000));

      // 3. Prepare Upload
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // 4. API Request
      const uploadPromise = fetch('http://localhost:5000/api/warranty/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      // Wait for both the visual delay (so user sees "Uploading") and the actual request
      // If the request is super fast, we still wait 2s total for the "Uploading" phase
      // Then we switch to "Analyzing" if the request is still going, or finish.
      // Actually, the requirement says: "Start a setTimeout for 2 seconds that sets uploadState('analyzing')... making the wait feel faster."
      // So we should fire the request immediately.
      
      const response = await uploadPromise;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const data = await response.json();

      // Ensure we show "Analyzing" for at least a moment if it was fast, 
      // or if the visual delay hasn't finished yet, we might want to wait for it?
      // Let's just ensure we are in 'analyzing' state visually before success if we want that flow.
      // But for now, let's just proceed to success.
      
      setUploadState('success');

      // 5. Success Animation Delay
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess(data.warranty);
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState('error');
      setErrorMessage(error.message || 'Failed to analyze receipt. Please try again.');
    }
  };

  const handleClose = () => {
    if (uploadState === 'uploading' || uploadState === 'analyzing') return;
    setSelectedFile(null);
    setUploadState('idle');
    setErrorMessage(null);
    onClose();
  };

  // Helper to render the button content based on state
  const renderButtonContent = () => {
    switch (uploadState) {
      case 'uploading':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading Receipt...
          </>
        );
      case 'analyzing':
        return (
          <>
            <Sparkles className="w-5 h-5 animate-pulse" />
            Analyzing with AI...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            Success!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            Try Again
          </>
        );
      default:
        return (
          <>
            <Sparkles className="w-5 h-5" />
            Analyze & Auto-fill
          </>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-[95%] max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add New Warranty
              </h2>
              <button
                onClick={handleClose}
                disabled={uploadState === 'uploading' || uploadState === 'analyzing'}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body (Upload Zone) */}
            <div className="p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div 
                onClick={handleUploadClick}
                className={`
                  border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
                  ${uploadState === 'error' 
                    ? 'border-red-500/50 bg-red-500/5' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }
                `}
              >
                {uploadState === 'success' ? (
                  <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                ) : uploadState === 'error' ? (
                  <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                ) : (
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform duration-200">
                    <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                )}

                <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  {selectedFile ? selectedFile.name : 'Click to upload receipt'}
                </p>
                
                {uploadState === 'error' ? (
                  <p className="text-sm text-red-500 font-medium mt-2">
                    {errorMessage}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    JPG, PNG, PDF up to 10MB
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button 
                onClick={handleAnalyze}
                disabled={!selectedFile || uploadState === 'uploading' || uploadState === 'analyzing' || uploadState === 'success'}
                className={`
                  w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg transition-all
                  ${uploadState === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                    : uploadState === 'success'
                    ? 'bg-green-600 text-white shadow-green-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:-translate-y-0.5'
                  }
                  disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed
                `}
              >
                {renderButtonContent()}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
