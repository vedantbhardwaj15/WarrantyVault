import { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Typography, CircularProgress, Button } from '@mui/material';

export default function LoginCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProfile } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Callback URL:', location.search); // Debug full URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      console.log('Processing token:', token.substring(0, 20) + '...'); // Partial log for security
      fetchProfile(token)
        .then(() => {
          console.log('Success - Redirecting to dashboard');
          navigate('/');
        })
        .catch((err) => {
          setError(`Auth failed: ${err.message || 'Check console for details'}`);
          console.error('Full error:', err); // Detailed log
        });
    } else {
      setError('No token in URL - Try logging in again.');
    }
  }, [navigate, location, fetchProfile]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>Back to Login</Button>
      </div>
    );
  }
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <CircularProgress />
      <Typography>Logging in... Please wait.</Typography>
    </div>
  );
}
