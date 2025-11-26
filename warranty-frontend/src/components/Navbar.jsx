import React from 'react';
import { supabase } from '../supabase';

export default function Navbar({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border)', 
      padding: '1rem 0',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            W
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>WarrantyVault</h1>
        </div>
        
        {session && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {session.user.email}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
