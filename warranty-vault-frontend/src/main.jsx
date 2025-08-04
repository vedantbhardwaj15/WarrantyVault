import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// Define your custom theme
const theme = createTheme({
  palette: {
    mode: 'light', // Use 'light' mode
    primary: { main: '#1976d2' }, // Warranty Vault blue
    secondary: { main: '#ffd600' }, // Secondary color
    background: { default: "#f4f6fa" }, // Background color
  },
  shape: { borderRadius: 12 }, // Rounded corners globally
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Global styles normalization */}
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
