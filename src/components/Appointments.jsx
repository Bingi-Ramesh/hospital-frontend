// src/components/Appointments.jsx
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';

const API = 'http://localhost:3000/api';

const emptyBill = {
  appointmentFee: '',
  doctorFee: '',
  ambulanceCharges: '',
  labCharges: '',
  bedCharges: '',
  xrayCharges: '',
  medicineCharges: '',
};

const Appointments = () => {
  /* ────────────── user & role ────────────── */
  const user  = JSON.parse(localStorage.getItem('user')) || {};
  const role  = (localStorage.getItem('role') || '').toLowerCase();

  const isPatient      = role === 'patient';
  const isDoctor       = role === 'doctor';
  const isReceptionist = role === 'receptionist' || role==='admin';
  const userId         = user._id;

  /* ────────────── state ────────────── */
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [snack, setSnack]               = useState({ open: false, msg: '', sev: 'info' });

  // receptionist bill dialog
  const [billOpen, setBillOpen]   = useState(false);
  const [billApptId, setBillAppt] = useState('');
  const [billData, setBillData]   = useState(emptyBill);

  // patient view dialog
  const [viewOpen, setViewOpen]   = useState(false);
  const [viewBill, setViewBill]   = useState(null);

  const showSnack  = (msg, sev='info') => setSnack({ open: true, msg, sev });
  const closeSnack = ()                 => setSnack(s => ({ ...s, open: false }));

  /* ────────────── fetch appointments ────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/get-all-appointments`);
        setAppointments(data.appointments || []);
      } catch (err) {
        console.error(err);
        showSnack('Could not load appointments', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ────────────── filter by role ────────────── */
  const visible = appointments.filter(a => {
    if (isPatient)      return a.patientId === userId;
    if (isDoctor)       return a.doctorId  === userId;
    /* admin, receptionist, etc. */
    return true;
  });

  /* ────────────── split past / upcoming ────────────── */
  const now       = new Date();
  const upcoming  = visible.filter(a => new Date(a.dateOfAppointment) >= now);
  const past      = visible.filter(a => new Date(a.dateOfAppointment) <  now);

  /* ────────────── cancel handler ────────────── */
  const cancelAppointment = async (id) => {
    try {
      await axios.post(`${API}/cancel-appointment`, { appointmentId: id });
      showSnack('Appointment cancelled', 'success');
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      showSnack('Failed to cancel', 'error');
    }
  };

  /* ────────────── receptionist: open bill dialog ────────────── */
  const openBillDialog = (appointmentId) => {
    setBillAppt(appointmentId);
    setBillData(emptyBill);
    setBillOpen(true);
  };

  const handleBillChange = (field) => (e) => {
    const v = e.target.value;
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setBillData(prev => ({ ...prev, [field]: v }));
    }
  };

  const total = useMemo(
    () =>
      Object.values(billData).reduce((sum, v) => sum + (parseFloat(v) || 0), 0),
    [billData]
  );

  const submitBill = async () => {
    try {
      await axios.post(`${API}/generate-bill`, {
        appointmentId: billApptId,
        ...billData,
        total,
      });
      showSnack('Bill generated', 'success');
      setBillOpen(false);
    } catch (err) {
      console.error(err);
      showSnack('Failed to generate bill', 'error');
    }
  };

  /* ────────────── patient: view bill ────────────── */
  const openViewDialog = async (appointmentId) => {
    try {
      const { data } = await axios.get(`${API}/get-bills`, {
        params: { appointmentId },
      });
      if (!data.bill) {
        showSnack('No bill found', 'warning');
        return;
      }
      setViewBill(data.bill);
      setViewOpen(true);
    } catch (err) {
      console.error(err);
      showSnack('Could not fetch bill', 'error');
    }
  };

  /* ────────────── render helper ────────────── */
  const renderSection = (title, list, canCancel, isPast) => (
    <>
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>{title}</Typography>
      <Divider />
      {list.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No appointments.</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {list.map(appt => (
            <Grid item xs={12} sm={6} md={4} key={appt._id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">
                    Dr.&nbsp;{appt.doctorName}&nbsp;|&nbsp;
                    {new Date(appt.dateOfAppointment).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Patient:&nbsp;{appt.patientName}
                  </Typography>
                 
                </CardContent>

                {/* ───── Actions ───── */}
                <CardActions>
                  {canCancel && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => cancelAppointment(appt._id)}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  {isPast && isReceptionist && (
                    <>
                     <Typography variant="body2">
                     Bill Status:&nbsp;{appt.status || "Not generated"}
                   </Typography>
                    <Button
                      size="small"
                      onClick={() => openBillDialog(appt._id)}
                    >
                      Generate/update&nbsp;Bill
                    </Button>
                    </>
                  )}

                  {isPast && isPatient && (
                    <>
                      <Typography variant="body2">
                     Bill Status:&nbsp;{appt.status || "Not generated"}
                   </Typography>
                   <Button
                      size="small"
                      onClick={() => openViewDialog(appt._id)}
                    >
                      View&nbsp;Bill
                    </Button>
                    </>
                   
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );

  /* ────────────── UI ────────────── */
  if (loading) return <Typography align="center" sx={{ mt: 4 }}>Loading appointments…</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Appointments
      </Typography>

      {renderSection('Upcoming Appointments', upcoming, true, false)}
      {renderSection('Past Appointments', past, false, true)}

      {/* ───── Snackbar ───── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeSnack} severity={snack.sev} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>

      {/* ───── Receptionist: Generate Bill Dialog ───── */}
      <Dialog open={billOpen} onClose={() => setBillOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Bill</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Appointment ID"
            value={billApptId}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
          {Object.keys(emptyBill).map((field) => (
            <TextField
              key={field}
              label={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              value={billData[field]}
              onChange={handleBillChange(field)}
              fullWidth
              margin="dense"
            />
          ))}
          <Box mt={2}>
            <TextField
              label="Total"
              value={total}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillOpen(false)}>Cancel</Button>
          <Button onClick={submitBill} variant="contained">Generate</Button>
        </DialogActions>
      </Dialog>

      {/* ───── Patient: View Bill Dialog ───── */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent dividers>
          {viewBill ? (
            <>
              <Typography variant="body2">Appointment ID: {viewBill.appointmentId}</Typography>
              <Divider sx={{ my: 1 }} />
              {Object.entries(viewBill).map(([k, v]) => (
                k !== '_id' && k !== 'appointmentId' && (
                  <Typography key={k} variant="body2">
                    {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}: ₹{v}
                  </Typography>
                )
              ))}
            </>
          ) : (
            <Typography>No data.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments;
