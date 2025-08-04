import { createContext, useState, useEffect } from 'react';
import api from '../api/api'; // From Step 3

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token); // Calls the function here too
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile after login (make sure this is async)
const fetchProfile = async (token) => {
  try {
    localStorage.setItem('token', token); // Store token immediately
    const { data } = await api.get('/auth/profile');
    setUser(data.user);
    console.log('Profile fetched successfully:', data.user); // Debug
  } catch (err) {
    console.error('Profile fetch failed:', err.response?.data || err.message);
    localStorage.removeItem('token'); // Clean up bad token
    throw err; // Let caller handle
  } finally {
    setLoading(false);
  }
};

  // Login handler (redirect to backend Google auth)
  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Ties to backend logout with blacklisting [4]
    } catch (err) {} // Proceed even if logout fails
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/'; // Redirect to home
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
