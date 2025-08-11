import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, Divider, Avatar, Snackbar, Alert,
  Button, List, ListItem, ListItemText, ListItemIcon, IconButton,TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE = import.meta.env.VITE_BACKEND_URL;
const API_HOST = `${API_BASE}`;

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [menuOpen, setMenuOpen] = useState(true); // ⬅ Sidebar toggle state

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
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(""); // doctor or receptionist
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
  });
  const handleOpen = (userType) => {
    setType(userType);
    setOpen(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const url = type === "doctor"
        ? `${API_HOST}/api/signup/doctor`
        : `${API_HOST}/api/signup/receptionist`;
  
      const res=await axios.post(url, formData);
      alert(res.data.message)
      handleClose();
    } catch (err) {
      console.log(err)
    }
  };
  const handleClose = () => {
    setOpen(false);
    setFormData({ fullname: "", email: "", password: "", mobile: "", age: "" });
  };
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    age: '',
    mobile:'',
  });
  const handleEditOpen = () => {
    setEditForm({
      fullname: userData.fullname || '',
      email: userData.email || '',
      age: userData.age || '',
      mobile:userData.mobile || ''
    });
    setEditOpen(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateProfile = async () => {
    try {
      const { data } = await axios.post(`${API_HOST}/api/update-profile`, {
        id: userData._id,
        ...editForm
      });
  
      setUserData(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
    }
  };
        

  /* ─────────── helpers ─────────── */
  const getImgSrc = () => {
    if (preview) return preview;
    if (userData?.profileImg) {
      const path = userData.profileImg.startsWith('/')
        ? userData.profileImg
        : '/' + userData.profileImg;
      return `${API_HOST}${path}`;
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

      const updatedUser = data.user;
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

  if (!userData) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>Loading profile…</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f9ff' }}>
      
      {/* Toggle Button */}
      <IconButton
  onClick={() => setMenuOpen(!menuOpen)}
  sx={{
    position: 'fixed',
    top: 75,
    left: menuOpen ? 300 : 10,
    zIndex: 2000,
    background: '#fff',
    boxShadow: 1,
    color: menuOpen ? 'black' : 'green',
    transition: 'left 0.3s ease',
  }}
>
  {menuOpen ? <CloseIcon /> : <MenuIcon />}
</IconButton>

      {/* Sidebar */}
      {menuOpen && (
        <Box sx={{ width: 280, backgroundColor: '#1976d2', color: '#fff', p: 3 }}>

          <Box sx={{ textAlign: 'center' }}>
           
           
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
                <Button onClick={handleUpload} color='fff' size="small" sx={{ mt: 1 }}>
                  Save Image
                </Button>
              )}
            </Grid>
            <Typography variant="h6" sx={{ mt: 2 }}>{userData.fullname || 'N/A'}</Typography>
            <Typography variant="body2">{role || 'N/A'}</Typography>
          </Box>

          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />

          <List>
            <ListItem>
              <ListItemIcon><PersonIcon sx={{ color: '#fff' }} /></ListItemIcon>
              <ListItemText primary="Profile Details" />
              
            </ListItem>
            <ListItem> <Typography>Name:{userData.fullname || 'N/A'}</Typography> </ListItem>
           
            <ListItem> <Typography>Email:{userData.email || 'N/A'}</Typography> </ListItem>
            <ListItem> <Typography>Mobile::{userData.mobile || 'N/A'}</Typography> </ListItem>
            <ListItem>  <Typography>Age:{userData.age || 'N/A'}</Typography> </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon sx={{ color: '#fff' }} /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box> 
      )}

      {/* Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
      <Card sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", mb: 1 }}
        >
         {userData.fullname || 'N/A'}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
         {role || 'N/A'}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#9a0007" },
            }}
            onClick={() => navigate("/reviews")}
          >
            Feedback
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#9a0007" },
            }}
            onClick={() => navigate("/appointments")}
          >
            Appointments
          </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#9a0007" },
              }}
              onClick={handleEditOpen}
            >
              Update Profile
            </Button>
         
         

        </Box>
        {role === "admin" && (
  <>
  <Box  sx={{
            display: "flex",
            mt:3,
            gap: 2,
            justifyContent: "center",
          }}>
    <Button   variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#9a0007" },
              }} onClick={() => handleOpen("doctor")}>Add Doctor</Button>
    <Button  variant="contained"
              sx={{
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#9a0007" },
              }} onClick={() => handleOpen("receptionist")}>Add Receptionist</Button>
    </Box>
  </>
)}
        {role === "doctor" && (
  <Typography variant="body1" sx={{ mt: 2 }}>
    {userData.description || "No description provided"}
  </Typography>
)}
      </Card>
    </Box>


      {/* Snackbar */}
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle>
    {type === "doctor" ? "Add Doctor" : "Add Receptionist"}
  </DialogTitle>

  <DialogContent>
    <TextField
      margin="dense"
      label="Full Name"
      name="fullname"
      value={formData.fullname}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Email"
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Password"
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Mobile"
      name="mobile"
      value={formData.mobile}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      margin="dense"
      label="Age"
      name="age"
      value={formData.age}
      onChange={handleChange}
      fullWidth
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose} color="error">Cancel</Button>
    <Button onClick={handleSubmit} variant="contained" color="primary">
      Submit
    </Button>
  </DialogActions>
</Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
  <DialogTitle>Update Profile</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      margin="dense"
      label="Full Name"
      name="fullname"
      value={editForm.fullname}
      onChange={handleEditChange}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Email"
      name="email"
      value={editForm.email}
      onChange={handleEditChange}
    />
    <TextField
      fullWidth
      margin="dense"
      label="Age"
      name="age"
      value={editForm.age}
      onChange={handleEditChange}
    />
      <TextField
      fullWidth
      margin="dense"
      label="Mobile"
      name="mobile"
      value={editForm.mobile}
      onChange={handleEditChange}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleUpdateProfile}>Update</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Profile;
