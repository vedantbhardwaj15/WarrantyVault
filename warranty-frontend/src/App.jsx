import React, { useEffect, useState, useRef, Suspense } from 'react';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import AppShowcase from './components/AppShowcase';
import UseCases from './components/UseCases';
import LoginModal from './components/LoginModal';
import CTA from './components/CTA';
import Footer from './components/Footer';
// Lazy load Dashboard
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
import AddWarrantyModal from './components/AddWarrantyModal';
import WarrantyDetailsModal from './components/WarrantyDetailsModal';
import DashboardNavbar from './components/DashboardNavbar';

// Simple Scroll Reveal Component
const ScrollReveal = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    
    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <div
      className={`reveal ${isVisible ? 'active' : ''} ${className}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const refreshDashboard = useRef(null);

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Check backend session on load
    // Skip this check if we are processing a redirect login (hash present)
    // to prevent race condition where 401 overrides the new session
    const isRedirectLogin = window.location.hash && window.location.hash.includes('access_token');
    
    if (!isRedirectLogin) {
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Not authenticated');
    })
    .then(data => {
      setSession({ user: data.user });
      setLoading(false);
      clearTimeout(timer);
    })
    .catch(() => {
      setSession(null);
      setLoading(false);
      clearTimeout(timer);
    });
    } else {
        // If it IS a redirect login, let onAuthStateChange handle everything
        // But ensures loading doesn't hang if onAuthStateChange fails to fire (fallback)
        // actually onAuthStateChange listens globally so it will fire.
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Send tokens to backend to set cookies
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        // Call backend logout to clear cookies
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST' });
        setSession(null);
      }
      
      setLoading(false);
      
      // Security: Clear access token from URL
      if (session && window.location.hash && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleDeleteWarranty = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/warranty/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Send cookies
      });

      if (response.ok) {
        setSelectedWarranty(null);
        if (refreshDashboard.current) {
          refreshDashboard.current();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete warranty:', errorData);
        alert(`Failed to delete warranty: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting warranty:', error);
      alert('Error deleting warranty. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="animate-fade-in">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {session ? (
        <DashboardNavbar session={session} />
      ) : (
        <Navbar 
          session={session} 
          onLogin={() => setShowLoginModal(true)}
        />
      )}
      
      <main className="flex-1 w-full flex flex-col">
        {!session ? (
          <>
            <Hero onGetStarted={() => setShowLoginModal(true)} />
            <HowItWorks />
            <AppShowcase />
            <UseCases />
            <CTA onGetStarted={() => setShowLoginModal(true)}/>
          </>
        ) : (
          <div className="container mx-auto px-6 mt-8">
            <Suspense fallback={<div className="text-center py-10">Loading Dashboard...</div>}>
              <Dashboard 
                onAddWarranty={() => setShowAddModal(true)} 
                onViewWarranty={(warranty) => setSelectedWarranty(warranty)}
                onRefresh={refreshDashboard}
              />
            </Suspense>
          </div>
        )}
      </main>
      
      <Footer />

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin} 
      />

      <AddWarrantyModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onUploadSuccess={() => {
          // console.log('Upload success, refreshing dashboard...');
          if (refreshDashboard.current) {
            refreshDashboard.current();
          }
        }}
      />

      <WarrantyDetailsModal 
        isOpen={!!selectedWarranty}
        onClose={() => setSelectedWarranty(null)}
        warranty={selectedWarranty}
        onDelete={() => handleDeleteWarranty(selectedWarranty?.id)}
      />
    </div>
  );
}
