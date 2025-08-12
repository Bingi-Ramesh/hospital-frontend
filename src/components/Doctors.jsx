import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_BACKEND_URL?.trim();

function Doctors() {
  const [snackbar,     setSnackbar]   = useState({ open: false, message: '', severity: 'info' });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const role = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(user)
    const fetchDoctors = async () => {
      setLoading(true);
      try {
      
        const res = await axios.get(`${API_BASE}/api/getDoctors`);
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleOpenDialog = (doctor) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
     
     setSnackbar({ open: true, message: 'Please login to book appointment', severity: 'error' });
     
     return;
    }

    setSelectedDoctor(doctor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedDoctor(null);
    setAppointmentDate('');
    setOpenDialog(false);
  };




  const handleSubmit = async () => {
    if (!appointmentDate) return alert("Select date");

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setSnackbar({ open: true, message: 'User info missing. Please login again.', severity: 'error' });
     
      return;
    }

    const patientId = user._id;
    const patientName = user.fullname;

    try {
      const res = await axios.post(`${API_BASE}/api/register-appointment`, {
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.fullname,
        patientId,
        patientName,
        dateOfAppointment: new Date(appointmentDate),
      });
      setSnackbar({ open: true, message: res.data.msg || 'Appointment booked!', severity: 'success' });
     // alert(res.data.msg || 'Appointment booked!');
      handleCloseDialog();
    } catch (error) {
      console.error("Error booking appointment:", error);
      setSnackbar({ open: true, message: "Failed to book appointment", severity: 'error' });
     
    }
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        textAlign="center"
        sx={{ color: "#8A2BE2" }}
      >
        Doctors
      </Typography>

      <Grid container spacing={2} sx={{ padding: "20px" }}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.email}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                maxWidth: 600,
                margin: "auto",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                  mb: 5,
                }}
              >
                {console.log(API_BASE, doctor.profileImg)};
                <img
                  // src={
                  //   doctor.profileImg
                  //     ? `${API_BASE}${doctor.profileImg.startsWith('/') ? '' : '/'}${doctor.profileImg}`
                  //     : '/default-profile.jpg'
                  // }
                  src={
                    doctor?.profileImg
                      ? `${API_BASE}${doctor.profileImg}`
                      : "/default-profile.jpg"
                  }
                  alt={doctor.fullName}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, padding: 1 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Dr. {doctor.fullname}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {doctor.specializations}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {doctor.course}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">Experience: {doctor.experience || 0}</Typography> */}
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() =>
                      navigate(`/doctors/doctordescription/${doctor._id}`, {
                        state: { doctor },
                      })
                    }
                    sx={{
                      mt: 2, // margin-top (theme spacing * 2 → usually 16px)

                      borderColor: "orange", // darker green border
                    }}
                  >
                    View Details
                  </Button>
                  {/* <Typography variant="body2" color="text.secondary">{doctor.email}</Typography> */}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleOpenDialog(doctor)}
                    sx={{
                      mt: 1,
                      borderColor: "orange", // darker green border
                    }}
                  >
                    Book Appointment
                  </Button>
                </CardActions>

                <CardActions>
                  {user.specializations ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{ mt: 1, borderColor: "orange" }}
                      onClick={() => {console.log(user)
                        navigate("/chat-doctor", { state: {  user } })
                      }}
                    >
                      View
                    </Button>
                  ) : // Render something else if needed for other roles, or null
                  <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{ mt: 1, borderColor: "orange" }}
                      onClick={() =>{ console.log(user)
                        navigate("/chat", { state: { doctor, user } })
                      }}
                    >
                      Chat
                    </Button>}
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Doctor ID"
            fullWidth
            value={selectedDoctor?._id || ""}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Doctor Name"
            fullWidth
            value={selectedDoctor?.fullname || ""}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Patient ID"
            fullWidth
            value={user._id || ""}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Patient Name"
            fullWidth
            value={user.fullname || ""}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date of Appointment"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Doctors;
