import React, { useState } from 'react';
import { supabase } from '../supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Upload({ session, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('warranties')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Analyze with Backend
      setAnalyzing(true);
      const token = (await supabase.auth.getSession()).data.session.access_token;
      
      const response = await fetch(`${API_URL}/api/ocr/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filePath, userId: session.user.id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');

      setFormData({
        ...data.result,
        file_path: filePath
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const response = await fetch(`${API_URL}/api/warranty/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Save failed');

      setFile(null);
      setFormData(null);
      if (onUploadComplete) onUploadComplete();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Add New Warranty</h2>
      
      {!formData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div 
            style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '2rem', 
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              transition: 'all 0.2s'
            }}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>📄</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {file ? file.name : 'Click to upload warranty slip or invoice'}
            </p>
          </div>

          {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</div>}

          <button 
            className="btn btn-primary" 
            onClick={handleUploadAndAnalyze}
            disabled={!file || loading}
            style={{ width: '100%' }}
          >
            {loading ? (analyzing ? 'Analyzing with AI...' : 'Uploading...') : 'Analyze & Auto-fill'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Product Name</label>
            <input 
              type="text" 
              value={formData.product_name || ''} 
              onChange={e => setFormData({...formData, product_name: e.target.value})}
              style={{ width: '100%' }}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Purchase Date</label>
              <input 
                type="date" 
                value={formData.purchase_date || ''} 
                onChange={e => setFormData({...formData, purchase_date: e.target.value})}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
              <input 
                type="date" 
                value={formData.expiry_date || ''} 
                onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Serial Number</label>
            <input 
              type="text" 
              value={formData.serial_number || ''} 
              onChange={e => setFormData({...formData, serial_number: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setFormData(null)}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Saving...' : 'Save Warranty'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
