import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [snackbar,     setSnackbar]   = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
 
 // const navigate = useNavigate();

  // Set default isLoggedIn to false once when component loads
  useEffect(() => {
    localStorage.setItem('isLoggedIn', 'false');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/login`, formData);
      const { message, role, user } = res.data;

      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      setSnackbar({ open: true, message: message, severity: 'info' });
     
      window.location.href = '/profile';
      // navigate('/profile');
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Login failed', severity: 'error' });
   
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 5,
          mb: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
           backgroundColor: '#D6DDF0',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom color="black">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={12}>
            <Typography align="center" color="black">
                Forgot Password?{' '}
                <Link to="/forgot-password" style={{ color: '	#2196F3' }}>
                  click here to reset
                </Link>
              </Typography>
              <Typography align="center" color="black">
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '	#2196F3' }}>
                  Sign Up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
