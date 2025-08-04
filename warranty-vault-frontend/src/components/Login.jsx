import { useContext } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h5">Welcome to Warranty Vault</Typography>
      <Button variant="contained" onClick={login} sx={{ mt: 2 }}>
        Login with Google
      </Button>
    </Box>
  );
}
