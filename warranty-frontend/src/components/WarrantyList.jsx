import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function WarrantyList({ session, refreshTrigger }) {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarranties();
  }, [refreshTrigger]);

  const fetchWarranties = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const response = await fetch(`${API_URL}/api/warranty/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.ok) {
        setWarranties(data.warranties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading warranties...</div>;

  if (warranties.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <p>No warranties found. Upload your first one!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {warranties.map(warranty => {
        const isExpired = new Date(warranty.expiry_date) < new Date();
        const daysLeft = Math.ceil((new Date(warranty.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
        
        return (
          <div key={warranty.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
            {warranty.card_url && (
              <div style={{ height: '160px', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1rem', backgroundColor: 'var(--bg-tertiary)' }}>
                <img src={warranty.card_url} alt="Warranty Slip" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            
            <div style={{ marginBottom: 'auto' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{warranty.product_name || 'Unknown Product'}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '999px', 
                  backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: isExpired ? 'var(--error)' : 'var(--success)',
                  fontWeight: '500'
                }}>
                  {isExpired ? 'Expired' : `${daysLeft} days left`}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(warranty.expiry_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {warranty.serial_number && <p>SN: {warranty.serial_number}</p>}
              {warranty.purchase_date && <p>Bought: {new Date(warranty.purchase_date).toLocaleDateString()}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
