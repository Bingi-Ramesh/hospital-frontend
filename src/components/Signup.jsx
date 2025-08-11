import { useState } from 'react';
import { Link } from 'react-router-dom'; // import Link
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

const Signup = () => {
  const [snackbar,     setSnackbar]   = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    mobile:'',
    password: '',
    
  });
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { fullName, age, email, password,mobile } = formData;
      const endpoint = `${API_BASE}/api/signup/patient`;

      await axios.post(endpoint, {
        fullname: fullName,
        age,
        email,
        password,
        mobile,
      });

      setSnackbar({ open: true, message: 'signup successful ', severity: 'success' });
      window.location.href = '/login';
      setFormData({
        fullName: '',
        age: '',
        email: '',
        password: '',
        mobile:'',
     
      });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Signup failed', severity: 'error' });
     // alert(err.response?.data?.message || 'Signup failed');
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
          backgroundColor: '##1E3A8A',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile.No"
                name="mobile"
                type="number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </Grid>

          

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
                Sign Up
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography align="center">
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2' }}>
                  Login
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

export default Signup;
