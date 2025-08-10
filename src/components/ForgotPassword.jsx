import { useState } from "react";
import axios from "axios";
import { Box, Button, Paper, TextField, Typography ,Alert, Snackbar} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset password
  const [email, setEmail] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const apiBase = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [snack, setSnack]  = useState({ open: false, msg: '', sev: 'info' });
  const showSnack  = (msg, sev='info') => setSnack({ open: true, msg, sev });
  const closeSnack = ()   => setSnack(s => ({ ...s, open: false }));
  // Step 1: Send email to backend
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBase}/api/patient-forgot-password`, { email });
  
      //alert(`OTP sent successfully check your inbox `); // for now showing directly
      showSnack('OTP sent successfully check your inbox ','success')
      setServerOtp(res.data.otp.otp.toString());
      setStep(2);
    } catch (err) {
      //alert(err.response?.data?.message || "Something went wrong");
      showSnack(err.response?.data?.message || "Something went wrong",'error')
    }
  };

  // Step 2: Compare OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOtp === serverOtp) {
      setStep(3);
    } else {
        showSnack("Invalid OTP",'error')
      //alert("Invalid OTP");
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (password !== retypePassword) {
        showSnack("Passwords do not match",'error')
      //alert("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`${apiBase}/api/update-patient-password`, {
        email,
        password,
      });
     // alert(res.data.message || "Password reset successfully");
     showSnack(res.data.message || "Password reset successfully",'success')
     setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      //alert(err.response?.data?.message || "Something went wrong");
      showSnack(err.response?.data?.message || "Something went wrong",'error')
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          borderRadius: 3,
        }}
      >
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Forgot Password
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button fullWidth type="submit" variant="contained" size="large">
              Submit
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Enter OTP
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              variant="outlined"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button fullWidth type="submit" variant="contained" size="large">
              Verify OTP
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Reset Your Password
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Retype New Password"
              variant="outlined"
              type="password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button fullWidth type="submit" variant="contained" size="large">
              Submit
            </Button>
          </form>
        )}
      </Paper>
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
    </Box>
  );
}
