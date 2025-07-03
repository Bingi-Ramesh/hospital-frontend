import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Divider, Avatar, Snackbar, Alert, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';


const API_BASE = import.meta.env.VITE_BACKEND_URL;

const API_HOST = `${API_BASE}`;   // change for prod
const Profile = () => {
  const navigate = useNavigate();

  const [userData,     setUserData]   = useState(null);
  const [role,         setRole]       = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview,      setPreview]    = useState('');

  const [snackbar,     setSnackbar]   = useState({ open: false, message: '', severity: 'info' });

  /* ─────────── load user on mount ─────────── */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !storedUser) {
      navigate('/login');
    } else {
      setUserData(JSON.parse(storedUser));
      setRole(storedRole);
      setPreview('');
    }
  }, [navigate]);

  /* ─────────── helpers ─────────── */
  const getImgSrc = () => {
    if (preview) return preview;                        // blob preview
    if (userData?.profileImg) {
      const path = userData.profileImg.startsWith('/')
        ? userData.profileImg
        : '/' + userData.profileImg;
      return `${API_HOST}${path}`;                      // → http://localhost:3000/uploads/...
    }
    return '/default-avatar.png';
  };

  /* ─────────── handlers ─────────── */
  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !userData?._id) {
      return setSnackbar({ open: true, message: 'Missing image or user ID', severity: 'warning' });
    }

    try {
      const formData = new FormData();
      formData.append('id', userData._id);
      formData.append('profileImg', selectedFile);

      const { data } = await axios.post(`${API_HOST}/api/update-profile-img`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = data.user;                    // backend returns { user: ... }
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setPreview('');
      setSelectedFile(null);
      setSnackbar({ open: true, message: 'Profile image updated', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    }
  };

  const handleRemove = async () => {
    try {
      const { data } = await axios.post(`${API_HOST}/api/remove-profile-img`, { id: userData._id });
      const updatedUser = data.user;
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setPreview('');
      setSnackbar({ open: true, message: 'Profile image removed', severity: 'info' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to remove image', severity: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  /* ─────────── render ─────────── */
  if (!userData) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>Loading profile…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, mb: 5 }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#d0e7ff', p: 3 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom color="primary">
              User Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
              {/* profile image + controls */}
              <Grid item xs={12} md={4} align="center">
                <Avatar
                  src={getImgSrc()}
                  alt="Profile"
                  sx={{ width: 150, height: 150, borderRadius: '50%', boxShadow: 2 }}
                />

                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <label htmlFor="upload-input">
                    <input
                      id="upload-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <UploadFileIcon sx={{ cursor: 'pointer', fontSize: 28 }} titleAccess="Upload image" />
                  </label>

                  <DeleteIcon
                    onClick={() => { setSelectedFile(null); setPreview(''); handleRemove(); }}
                    sx={{ cursor: 'pointer', fontSize: 28 }}
                    titleAccess="Remove image"
                  />
                </Box>

                {selectedFile && (
                  <Button onClick={handleUpload} size="small" sx={{ mt: 1 }}>
                    Save Image
                  </Button>
                )}
              </Grid>

              {/* user details */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6">Full Name:</Typography>
                <Typography>{userData.fullname || 'N/A'}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>Age:</Typography>
                <Typography>{userData.age || 'N/A'}</Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6">User Type:</Typography>
                <Typography>{role || 'N/A'}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>Email:</Typography>
                <Typography>{userData.email || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
