import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Trash2, Copy, Calendar, Flag, Check, Clock, Search, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

export default function WarrantyDetailsModal({ isOpen, onClose, warranty, onDelete }) {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interaction States
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'downloading', 'success', 'error'
  const [deleteStatus, setDeleteStatus] = useState('idle'); // 'idle', 'confirming', 'deleting', 'success'

  if (!warranty && isOpen) return null;

  // Safe calculation - only runs if warranty exists
  const percentageRemaining = warranty ? (warranty.daysLeft / warranty.totalDays) * 100 : 0;
  
  // Determine colors and status based on days remaining
  const getProgressBarColor = () => {
    if (warranty.daysLeft <= 0) return 'bg-red-500';
    if (warranty.daysLeft < 30) return 'bg-red-500';
    if (percentageRemaining < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (warranty.daysLeft <= 0) return 'Expired';
    if (warranty.daysLeft < 30) return 'Expiring Soon';
    if (percentageRemaining < 50) return 'Active';
    return 'Active';
  };

  const getStatusColor = () => {
    if (warranty.daysLeft <= 0) return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    if (warranty.daysLeft < 30) return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    if (percentageRemaining < 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
    return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  };

  // Handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(warranty.serial_number || 'N/A');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = async () => {
    if (downloadStatus === 'downloading' || downloadStatus === 'success') return;

    const receiptUrl = warranty.receiptUrl || warranty.receipt_url || warranty.imageUrl || warranty.receipt_image || warranty.image;
    
    if (!receiptUrl) {
      alert('No receipt image available to download');
      return;
    }
    
    try {
      setDownloadStatus('downloading');
      
      // Fetch the image
      const response = await fetch(receiptUrl);
      const blob = await response.blob();
      
      // Detect file extension
      const mimeType = blob.type;
      let extension = 'jpg';
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
      else if (mimeType.includes('pdf')) extension = 'pdf';
      else if (mimeType.includes('webp')) extension = 'webp';
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${warranty.name.replace(/\s+/g, '_')}_receipt.${extension}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Success Animation
      setDownloadStatus('success');
      setTimeout(() => {
        setDownloadStatus('idle');
      }, 1000); // Show tick for 1s

    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 2000);
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteStatus('confirming');
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteStatus('deleting');
      await onDelete(); // Assume onDelete returns a promise
      setDeleteStatus('success');
      
      // Close after showing success tick
      setTimeout(() => {
        onClose();
        // Reset state after close
        setTimeout(() => setDeleteStatus('idle'), 300); 
      }, 1500);
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteStatus('idle'); // Or error state
      alert('Failed to delete warranty');
    }
  };

  const handleCancelDelete = () => {
    setDeleteStatus('idle');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10"
          >
            
            {/* DELETE CONFIRMATION OVERLAY */}
            <AnimatePresence>
              {deleteStatus !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
                >
                  {deleteStatus === 'confirming' && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-sm w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                        <Trash2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Warranty?</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                        Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{warranty.name}"</span>? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleCancelDelete}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleConfirmDelete}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {deleteStatus === 'deleting' && (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
                      <p className="text-lg font-medium text-slate-900 dark:text-white">Deleting...</p>
                    </div>
                  )}

                  {deleteStatus === 'success' && (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                        <Check className="w-8 h-8" strokeWidth={3} />
                      </div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">Deleted!</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Header with Close Button - Always Visible */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-2">
                {warranty.name}
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors shrink-0">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col md:grid md:grid-cols-5 min-h-full">
                
                {/* COLUMN 1: DETAILS (Left Side - 2/5) */}
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col gap-6 md:gap-8 bg-white dark:bg-slate-900">
                  
                  {/* Header Info - Desktop Only (Mobile has it in fixed header) */}
                  <div className="hidden md:block space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                          {warranty.name}
                        </h2>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor()}`}>
                          {getStatusText()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge - Mobile Only */}
                  <div className="md:hidden">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                      {getStatusText()}
                    </span>
                  </div>

              {/* The "Big Stat" Card */}
              <div className="relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                
                {/* 3D Lift Effect - Shadow Illumination */}
                {/* Top-left light source */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none rounded-2xl" />
                
                {/* Bottom-right shadow */}
                <div className="absolute inset-0 bg-gradient-to-tl from-black/5 via-transparent to-transparent dark:from-black/20 dark:via-transparent dark:to-transparent pointer-events-none rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    <Clock className="w-4 h-4" /> Time Remaining
                  </div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                    {warranty.daysLeft} <span className="text-lg font-medium text-slate-500">days</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-300/50 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getProgressBarColor()}`}
                      style={{ width: `${Math.min(percentageRemaining, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Purchased
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDate(warranty.purchase_date)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Expires
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Flag className="w-4 h-4 text-slate-400" />
                    {warranty.expires}
                  </div>
                </div>
              </div>

              {/* Serial Number */}
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Serial Number
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group text-left"
                >
                  <code className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate">
                    {warranty.serial_number || 'N/A'}
                  </code>
                  <div className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </div>
                </button>
              </div>

              {/* Action Bar (Mobile Only) */}
              <div className="flex gap-2 mt-auto md:hidden">
                 <button 
                   onClick={handleDownload} 
                   disabled={downloadStatus === 'downloading'}
                   className="flex-1 bg-slate-100 dark:bg-slate-800 py-3 rounded-xl font-medium text-slate-900 dark:text-white flex items-center justify-center gap-2"
                 >
                    {downloadStatus === 'downloading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     downloadStatus === 'success' ? <Check className="w-4 h-4 text-green-500" /> :
                     <Download className="w-4 h-4" />}
                    Download
                 </button>
                 <button onClick={handleDeleteClick} className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 py-3 rounded-xl font-medium">Delete</button>
              </div>

            </div>

            {/* COLUMN 2: RECEIPT PREVIEW (Right Side - 3/5) */}
            <div className="md:col-span-3 bg-slate-100 dark:bg-slate-950/50 p-8 flex flex-col items-center justify-center relative overflow-hidden group min-h-[450px]">
              
              {/* Header Actions (Floating) */}
              <div className="absolute top-6 right-6 flex items-center gap-2 z-20 hidden md:flex">
                <button 
                  onClick={handleDownload} 
                  disabled={downloadStatus === 'downloading'}
                  className={`p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm transition-all hover:scale-105 ${
                    downloadStatus === 'success' ? 'text-green-500' : 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
                  }`}
                  title="Download Receipt"
                >
                  {downloadStatus === 'downloading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : downloadStatus === 'success' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </button>
                <button 
                  onClick={handleDeleteClick} 
                  className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-all hover:scale-105"
                  title="Delete Warranty"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={onClose} className="p-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all hover:scale-105 ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Spacer to balance the bottom text and center the receipt */}
              <div className="h-11 w-full hidden md:block" />

              <div 
                className="relative w-64 transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 cursor-pointer drop-shadow-2xl"
                onClick={() => setShowFullScreen(true)}
              >
                  {/* Top Zig-Zag Edge - Light Mode */}
                  <div 
                    className="w-full h-3 relative rotate-180 dark:hidden overflow-hidden"
                    style={{
                      backgroundImage: "linear-gradient(45deg, transparent 50%, #ffffff 50%), linear-gradient(-45deg, transparent 50%, #ffffff 50%)",
                      backgroundSize: "16px 16px",
                      backgroundRepeat: "repeat-x"
                    }}
                  >
                    {/* 3D Shadow for zig-zag edge */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  </div>
                  {/* Top Zig-Zag Edge - Dark Mode */}
                  <div 
                    className="w-full h-3 relative rotate-180 hidden dark:block overflow-hidden"
                    style={{
                      backgroundImage: "linear-gradient(45deg, transparent 50%, #1e293b 50%), linear-gradient(-45deg, transparent 50%, #1e293b 50%)",
                      backgroundSize: "16px 16px",
                      backgroundRepeat: "repeat-x"
                    }}
                  >
                    {/* 3D Shadow for zig-zag edge */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                  </div>

                  {/* Receipt Body */}
                  <div className="relative px-6 py-6 flex flex-col items-center gap-4 bg-white dark:bg-slate-800 min-h-[280px] overflow-hidden">
                     
                     {/* 3D CURVED PAPER EFFECT - Dual Layer */}
                     
                     {/* Layer 1: Dark Side Shadows (Left & Right) */}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 dark:from-black/30 dark:via-transparent dark:to-black/30 pointer-events-none z-10" />
                     
                     {/* Layer 2: Central Light Beam (Makes center pop forward) */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:from-transparent dark:via-white/5 dark:to-transparent pointer-events-none z-10" />

                     {/* Faint Logo */}
                     <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl mb-2 opacity-50 text-slate-400 dark:text-slate-500">🧾</div>
                     
                     {/* Fake Text Lines */}
                     <div className="w-24 h-3 bg-slate-200 dark:bg-slate-600 rounded-full" />
                     <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-600 my-1" />
                     
                     {/* Rows */}
                     <div className="w-full space-y-3 opacity-60">
                        <div className="flex justify-between"><div className="w-16 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /><div className="w-8 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /></div>
                        <div className="flex justify-between"><div className="w-12 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /><div className="w-8 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /></div>
                        <div className="flex justify-between"><div className="w-20 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /><div className="w-8 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" /></div>
                     </div>

                     {/* Total */}
                     <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-600 my-2" />
                     <div className="w-full flex justify-between items-center">
                        <div className="w-10 h-3 bg-slate-400 dark:bg-slate-600 rounded-full" />
                        <div className="w-14 h-4 bg-slate-800 dark:bg-slate-300 rounded-full" />
                     </div>
                     
                     {/* BARCODE & SERIAL (Colored) */}
                     <div className="mt-auto w-full flex flex-col items-center gap-2 pt-4">
                        {/* Static Barcode */}
                        <div className="h-8 w-full flex justify-center gap-[2px] opacity-80 overflow-hidden">
                             {[...Array(20)].map((_, i) => (
                                 <div key={i} className={`h-full bg-slate-800 dark:bg-slate-300 ${Math.random() > 0.5 ? 'w-1' : 'w-2'}`} />
                             ))}
                        </div>
                        {/* Serial Number */}
                        <code className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">SN:</span> {warranty.serial_number || 'XXXX-XXXX'}
                        </code>
                     </div>
                  </div>

                  {/* Bottom Zig-Zag Edge - Light Mode */}
                  <div 
                    className="w-full h-3 relative dark:hidden overflow-hidden"
                    style={{
                      backgroundImage: "linear-gradient(45deg, transparent 50%, #ffffff 50%), linear-gradient(-45deg, transparent 50%, #ffffff 50%)",
                      backgroundSize: "16px 16px",
                      backgroundRepeat: "repeat-x"
                    }}
                  >
                    {/* 3D Shadow for zig-zag edge */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                  </div>
                  {/* Bottom Zig-Zag Edge - Dark Mode */}
                  <div 
                    className="w-full h-3 relative hidden dark:block overflow-hidden"
                    style={{
                      backgroundImage: "linear-gradient(45deg, transparent 50%, #1e293b 50%), linear-gradient(-45deg, transparent 50%, #1e293b 50%)",
                      backgroundSize: "16px 16px",
                      backgroundRepeat: "repeat-x"
                    }}
                  >
                    {/* 3D Shadow for zig-zag edge */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                  </div>
              </div>

              {/* Interaction Text - Below Receipt */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium animate-pulse">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline text-blue-600 dark:text-blue-400">Click to see receipt</span>
                <span className="md:hidden text-purple-600 dark:text-purple-400">Tap to see receipt</span>
              </div>

              </div>

            </div>
            {/* End of Grid Container */}
            
          </div>
          {/* End of Scrollable Content */}

          </motion.div>
        </div>
      )}

      {/* Full Screen Modal - Original Receipt Image */}
      {showFullScreen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md" onClick={() => setShowFullScreen(false)}>
          <button 
            onClick={() => setShowFullScreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          {/* Receipt Image Viewer */}
          <div className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {warranty.receiptUrl || warranty.receipt_url || warranty.imageUrl ? (
              <img 
                src={warranty.receiptUrl || warranty.receipt_url || warranty.imageUrl} 
                alt="Receipt"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl text-center max-w-sm">
                <p className="text-slate-900 dark:text-white font-medium text-lg mb-2">No Receipt Image</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">This warranty doesn't have an uploaded receipt image.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}