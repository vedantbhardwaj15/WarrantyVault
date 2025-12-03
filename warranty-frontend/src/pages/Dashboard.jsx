import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, PackageOpen, Clock, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';
import EditWarrantyModal from '../components/EditWarrantyModal';

/**
 * Helper: Transform raw warranty data from backend to UI-ready format
 */
function processWarrantyData(warranties) {
  const now = new Date(); // Calculate once
  
  return warranties.map(w => {
    const expiryDate = w.expiry_date ? new Date(w.expiry_date) : null;
    const purchaseDate = w.purchase_date ? new Date(w.purchase_date) : null;
    
    // Calculate total days (purchase to expiry)
    let durationInDays = w.warranty_period || 365;
    if (purchaseDate && expiryDate) {
      durationInDays = Math.ceil((expiryDate - purchaseDate) / (1000 * 60 * 60 * 24));
    }

    // Calculate days left
    let daysLeft = 0;
    let status = 'Unknown';
    let statusColor = 'gray';
    
    if (expiryDate) {
      daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      // Determine status based on days left
      const percentageRemaining = durationInDays > 0 ? (daysLeft / durationInDays) * 100 : 0;

      if (daysLeft <= 0) {
        status = 'Expired';
        statusColor = 'red'; // Modal uses red for expired
      } else if (daysLeft < 30) {
        status = 'Expiring Soon';
        statusColor = 'red'; // Modal uses orange/red for < 30 days
      } else if (percentageRemaining < 50) {
        status = 'Active';
        statusColor = 'yellow';
      } else {
        status = 'Active';
        statusColor = 'green';
      }
    }
    
    // Format expiry date for display
    const expiresFormatted = expiryDate 
      ? expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Unknown';
    
    return {
      id: w.id,
      name: w.product_name || 'Unknown Product',
      status,
      statusColor,
      daysLeft: Math.max(0, daysLeft), // Don't show negative days
      totalDays: durationInDays,
      expires: expiresFormatted,
      image: "📄", // Fallback emoji (URL is handled by receiptUrl)
      receiptUrl: w.card_url, // Store for modal & display
      // Pass through all original data for modal
      ...w
    };
  });
}

// Card animation variants (Moved outside component to prevent recreation)
const cardVariants = {
  initial: { 
    y: 0, 
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" 
  },
  hover: { 
    y: -4,
    boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.25)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    transition: { duration: 0.2 }
  },
  tap: { 
    y: 0,
    scale: 0.98,
    boxShadow: "0 5px 15px -3px rgba(59, 130, 246, 0.2)",
    transition: { duration: 0.1 }
  }
};

export default function Dashboard({ onAddWarranty, onViewWarranty, onRefresh }) {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWarranty, setEditingWarranty] = useState(null);

  const handleEditClick = (e, warranty) => {
    e.stopPropagation(); // Prevent opening details modal
    setEditingWarranty(warranty);
  };

  const handleUpdateSuccess = (updatedWarranty) => {
    // Refresh list to show updated data
    fetchWarranties();
  };

  // Fetch warranties from backend (Memoized)
  const fetchWarranties = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session, skipping fetch');
        setWarranties([]);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/warranty/list', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Warranties fetched:', data);
        
        // Process and transform data
        const processedWarranties = processWarrantyData(data.warranties || []);
        setWarranties(processedWarranties);
      } else {
        throw new Error(`Failed to fetch warranties: ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Error fetching warranties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed as supabase is external and setters are stable

  useEffect(() => {
    fetchWarranties();
    
    // Expose refresh function to parent
    if (onRefresh) {
      onRefresh.current = fetchWarranties;
    }
  }, [onRefresh, fetchWarranties]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Warranties</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Loading your assets...</p>
            </div>
          </div>

          {/* Loading Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Warranties</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We encountered an issue while loading your warranties. Please try again.
            </p>
            <button 
              onClick={fetchWarranties}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (warranties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Warranties</h1>
          </div>
          
          {/* Dot Pattern Background */}
          <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Warranties Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              Start by uploading your first warranty or receipt to keep track of all your products in one place.
            </p>
            <button 
              onClick={onAddWarranty}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Warranty
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD WITH DATA ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Warranties</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {warranties.length} {warranties.length === 1 ? 'warranty' : 'warranties'} • Manage and track your assets
            </p>
          </div>
          
          <button 
            onClick={onAddWarranty}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Warranty
          </button>
        </div>

        {/* Warranty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {warranties.map((warranty) => (
            
            <motion.div 
              key={warranty.id}
              onClick={() => onViewWarranty && onViewWarranty(warranty)}
              className="relative group cursor-pointer"
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Card */}
              <motion.div 
                variants={cardVariants}
                className="relative h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col"
              >
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    {/* Receipt Icon/Image */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-2xl shadow-inner overflow-hidden">
                      {warranty.receiptUrl ? (
                        <img src={warranty.receiptUrl} alt="receipt" className="w-full h-full object-cover" />
                      ) : (
                        <span>{warranty.image}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        {warranty.name}
                      </h3>
                      {/* Status Badge with Dynamic Colors */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1.5 ${
                        warranty.statusColor === 'red'
                          ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                          : warranty.statusColor === 'yellow'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                          : warranty.statusColor === 'gray'
                          ? 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                      }`}>
                        {warranty.status}
                      </span>
                    </div>
                  </div>

                  {/* Update Pill Button */}
                  <button
                    onClick={(e) => handleEditClick(e, warranty)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 dark:bg-slate-700 dark:hover:bg-blue-900/30 dark:text-slate-300 dark:hover:text-blue-400 text-xs font-medium transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    Update
                  </button>
                </div>

                {/* Progress Section */}
                <div className="mt-auto space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Days Left
                      </span>
                      <span className={`font-bold ${
                        warranty.statusColor === 'red' ? 'text-red-500' 
                        : warranty.statusColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400'
                        : warranty.statusColor === 'gray' ? 'text-gray-500'
                        : 'text-slate-900 dark:text-white'
                      }`}>
                        {warranty.daysLeft} days
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2.5 w-full bg-slate-300/50 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          warranty.statusColor === 'red' ? 'bg-red-500'
                          : warranty.statusColor === 'yellow' ? 'bg-yellow-500'
                          : warranty.statusColor === 'gray' ? 'bg-gray-400'
                          : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (warranty.daysLeft / warranty.totalDays) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Expiration Date */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {warranty.expires}</span>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
      
      <EditWarrantyModal 
        isOpen={!!editingWarranty}
        onClose={() => setEditingWarranty(null)}
        warranty={editingWarranty}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}