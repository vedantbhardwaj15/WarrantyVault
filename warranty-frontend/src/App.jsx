import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import WarrantyList from './components/WarrantyList';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-fade-in">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="card animate-fade-in" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '2rem',
            margin: '0 auto 1.5rem'
          }}>
            W
          </div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>WarrantyVault</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Never lose a warranty slip again. Track, organize, and get notified.
          </p>
          <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%', padding: '0.75rem' }}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <Navbar session={session} />
      
      <main className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>My Warranties</h2>
          <button 
            className={`btn ${showUpload ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? 'Close' : 'Add New Warranty'}
          </button>
        </div>

        {showUpload && (
          <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
            <Upload 
              session={session} 
              onUploadComplete={() => {
                setShowUpload(false);
                setRefreshTrigger(prev => prev + 1);
              }} 
            />
          </div>
        )}

        <WarrantyList session={session} refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
}
