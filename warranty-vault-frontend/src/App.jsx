import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import WarrantyDetails from "./components/WarrantyDetails";
import Login from "./components/Login";
import LoginCallback from "./components/LoginCallback";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Warranty Vault
          </Typography>
          {user && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/upload"
                sx={{ mr: 1 }}
              >
                Upload
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warranty/:id"
            element={
              <ProtectedRoute>
                <WarrantyDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/login/callback" element={<LoginCallback />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
